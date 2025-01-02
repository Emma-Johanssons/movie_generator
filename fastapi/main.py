from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import timedelta
from models import BlacklistedToken, User, LikedMovie
from schemas import UserCreate
from database import SessionLocal
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from security import authenticate_user, create_access_token, verify_token, is_token_blacklisted, ACCESS_TOKEN_EXPIRE_MINUTES, get_user_from_token
from crud import get_user_by_username, create_user
import os
import httpx


app = FastAPI()
load_dotenv(override=True)
API_KEY = os.getenv("API_KEY")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl = "token")

origins = [
    "http://localhost:3000",
    "http://localhost",  
    "http://127.0.0.1",
    "https://movie-generator-i53u-qntn5si8i-emmas-projects-c8b5acd9.vercel.app",  
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

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}

@app.post("/register")
def register_user(user: UserCreate, db:Session = Depends(get_db)):
    db_user = get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Email ealready registered")
    return create_user(db=db, user=user)

@app.post("/token")
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
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
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.username, "first_name": user.first_name},
            expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}
    except Exception as e:
        print(f"Error during login: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

    
@app.get("/verify-token/{token}")
async def verify_user_token(token:str, db:Session = Depends(get_db)):
    verify_token(token=token, db=db)
    return {"message": "Token is valid"}

@app.post("/logout")
def logout(token:str = Depends(oauth2_scheme), db:Session = Depends(get_db)):
    if is_token_blacklisted(db, token):
        raise HTTPException(status_code=400, detail="Token is already blacklisted")
    blacklisted_token = BlacklistedToken(token=token)
    db.add(blacklisted_token)
    db.commit()

    return{"message": "Logged out successfully, token is blacklisted"}

TMDB_API_URL = f"https://api.themoviedb.org/3/movie/popular?api_key={API_KEY}"

@app.get("/popular-movies")
async def get_popular_movies():
     async with httpx.AsyncClient() as client:
        response = await client.get(TMDB_API_URL)
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Failed to fetch popular movies")

        data = response.json()
        return {"results": data["results"]}