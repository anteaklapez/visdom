from typing import List

from pydantic import BaseModel
from database import Base
from sqlalchemy import Column, String, UUID, Float, ForeignKey, Integer
from sqlalchemy.orm import relationship
import uuid

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None

class User(BaseModel):
    username: str
    email: str

class UserDB(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String, primary_key=False, nullable=False)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)


class Image(BaseModel):
    id: str
    full: str
    small: str

class ImageDB(Base):
    __tablename__ = "images"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    full = Column(String, nullable=False)
    small = Column(String, nullable=False)

    basic_object_id = Column(UUID(as_uuid=True), ForeignKey("basic_object.id"), nullable=False)
    building_id = Column(UUID(as_uuid=True), ForeignKey("building.id"), nullable=False)
    car_id = Column(UUID(as_uuid=True), ForeignKey("car.id"), nullable=False)


class BasicObject(BaseModel):
    id: str
    subject: str
    price: float
    description: str
    image: List[Image]


class BasicObjectDB(Base):
    __tablename__ = "basic_object"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    subject = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    description = Column(String, nullable=False)
    images = relationship("ImageDB", back_populates="basic_object_id", cascade="all, delete-orphan")

class Building(BaseModel):
    id: str
    location: str
    title: str
    price: float
    image: List[Image]
    roomNumber: int | None
    buildingArea: int | None
    gardenArea: int | None
    buildYear: int | None
    buildingType: str | None
    description: str | None

class BuildingDB(Base):
    __tablename__ = "buildings"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    location = Column(String, nullable=False)
    title = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    roomNumber = Column(Integer, nullable=True)
    buildingArea = Column(Integer, nullable=True)
    gardenArea = Column(Integer, nullable=True)
    buildYear = Column(Integer, nullable=True)
    buildingType = Column(String, nullable=True)
    description = Column(String, nullable=True)

    image = relationship("ImageDB", back_populates="images")

class Car(BaseModel):
    id: str
    name: str
    brand: str
    model: str
    image: List[Image]
    price: float
    mileage: int | None
    productionYear: int | None
    modelYear: int | None
    engineSize: int | None
    location: str | None
    description: str | None
    power: int | None
    engine: str | None
    transmission: str | None

class CarDB(Base):
    __tablename__ = "cars"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    brand = Column(String, nullable=False)
    model = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    mileage = Column(Integer, nullable=True)
    productionYear = Column(Integer, nullable=True)
    modelYear = Column(Integer, nullable=True)
    engineSize = Column(Integer, nullable=True)
    location = Column(String, nullable=True)
    description = Column(String, nullable=True)
    power = Column(Integer, nullable=True)
    engine = Column(String, nullable=True)
    transmission = Column(String, nullable=True)

    image = relationship("ImageDB", back_populates="images")








