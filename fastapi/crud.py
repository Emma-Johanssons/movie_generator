from sqlalchemy.orm import Session
from passlib.context import CryptContext
from models import User
from schemas import UserCreate

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_user_by_username(db:Session, username:str):
    return db.query(User).filter(User.username == username).first()

def create_user(db:Session, user:UserCreate):
    hashed_password = pwd_context.hash(user.password)
    db_user = User(username=user.username, hashed_password=hashed_password, first_name=user.first_name,)
    db.add(db_user)
    db.commit()
    return db_user



