from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext
from models import User, BlacklistedToken
from database import SessionLocal, engine
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from typing import Optional

app = FastAPI()
load_dotenv(override=True)
ENV_SECRET_KEY = os.getenv("SECRET_KEY")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl = "token")

origins = [
    "http://localhost:3000",
    "http://localhost",  
    "http://127.0.0.1",  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*", "Authorization"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = ENV_SECRET_KEY
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

class UserCreate(BaseModel):
    username: str
    password: str
    first_name: Optional[str] = None

def get_user_by_username(db:Session, username:str):
    return db.query(User).filter(User.username == username).first()

def create_user(db:Session, user:UserCreate):
    hashed_password = pwd_context.hash(user.password)
    db_user = User(username=user.username, hashed_password=hashed_password, first_name=user.first_name,)
    db.add(db_user)
    db.commit()
    return "complete"

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}

@app.post("/register")
def register_user(user:UserCreate, db:Session = Depends(get_db)):
    db_user = get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Email ealready registered")
    return create_user(db=db, user=user)

def authenticate_user(username: str, password:str, db:Session):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        return False
    if not pwd_context.verify(password, user.hashed_password):
        return False
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@app.post("/token")
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # Kontrollera om användarnamn och lösenord är tomma
    if not form_data.username or not form_data.password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username and password are required"
        )
    try:
        user = authenticate_user(form_data.username, form_data.password, db)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        # Skapa access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.username, "first_name": user.first_name},
            expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}
    except Exception as e:
        print(f"Error during login: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

def is_token_blacklisted(db:Session, token:str) -> bool:
    return db.query(BlacklistedToken).filter(BlacklistedToken.token == token).first() is not None

    
@app.get("/verify-token/{token}")
async def verify_user_token(token:str, db:Session = Depends(get_db)):
    verify_token(token=token, db=db)
    return {"message": "Token is valid"}
def verify_token(token: str, db:Session):
    try:
        if is_token_blacklisted(db, token):
            raise HTTPException(status_code=401, detail="Token is invalidated")

        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=403, detail="Token is invalid or has expired")
        return payload
    except JWTError:
        raise HTTPException(status_code=403, detail="Token is invalid or has expired")
@app.post("/logout")
def logout(token:str = Depends(oauth2_scheme), db:Session = Depends(get_db)):
    if is_token_blacklisted(db, token):
        raise HTTPException(status_code=400, detail="Token is already blacklisted")
    blacklisted_token = BlacklistedToken(token=token)
    db.add(blacklisted_token)
    db.commit()

    return{"message": "Logged out successfully, token is blacklisted"}