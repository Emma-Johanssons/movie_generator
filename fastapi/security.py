from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from models import User, BlacklistedToken
from dotenv import load_dotenv
import os
from typing import Optional
from fastapi import HTTPException
from crud import get_user_by_username

load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

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

def is_token_blacklisted(db:Session, token:str) -> bool:
    return db.query(BlacklistedToken).filter(BlacklistedToken.token == token).first() is not None

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
    
def get_user_from_token(token: str, db: Session):
    payload = verify_token(token, db)  # Verifierar och avkodar tokenet
    username: str = payload.get("sub")
    user = get_user_by_username(db, username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user