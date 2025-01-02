from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base
from database import engine

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    first_name = Column(String)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)

    liked_movies = relationship("LikedMovie", back_populates="user")


class BlacklistedToken(Base):
    __tablename__= "blacklisted_tokens"
    id = Column(Integer, primary_key=True, index=True)
    token = Column(String, unique=True, nullable=False)
    created_at = Column(DateTime, default = func.now())

    def __repr__(self):
        return f"<BlacklistedToken token={self.token}>"
    
class LikedMovie(Base):
    __tablename__ = "liked_movies"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    movie_id = Column(Integer)

    user = relationship("User", back_populates="liked_movies")

User.metadata.create_all(bind=engine)