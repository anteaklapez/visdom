import sqlalchemy as sa
import os
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import declarative_base

engine = sa.create_engine(os.getenv('DATABASE_URL'))

Base = declarative_base()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()