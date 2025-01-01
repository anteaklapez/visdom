from typing import List

from pydantic import BaseModel
from sqlalchemy.dialects.postgresql import JSONB

from database import Base
from sqlalchemy import Column, String, UUID, Float, Integer
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
    username = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)


class Image(BaseModel):
    id: str
    full: str
    small: str

    model_config = {
        "from_attributes": True,
        "populate_by_name": True,
    }


class BasicObject(BaseModel):
    id: uuid.UUID | None = None
    subject: str
    price: float
    description: str | None
    images: List[Image] = []

    model_config = {
        "from_attributes": True,
        "populate_by_name": True,
    }




class BasicObjectDB(Base):
    __tablename__ = "basic_objects"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    subject = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    description = Column(String, nullable=True)
    images = Column(JSONB, default=[])


class Building(BaseModel):
    id: uuid.UUID | None = None
    location: str
    title: str
    price: float
    roomNumber: int | None
    buildingArea: int | None
    gardenArea: int | None
    buildYear: int | None
    buildingType: str | None
    floors: str | None
    bathroomNumber: int | None
    description: str | None
    images: List[Image] = []

    model_config = {
        "from_attributes": True,
        "populate_by_name": True,
    }

class BuildingDB(Base):
    __tablename__ = "buildings"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    location = Column(String, nullable=False)
    title = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    roomNumber = Column('roomnumber', Integer, nullable=True)
    buildingArea = Column('buildingarea', Integer, nullable=True)
    gardenArea = Column('gardenarea', Integer, nullable=True)
    buildYear = Column('buildyear', Integer, nullable=True)
    buildingType = Column('buildingtype', String, nullable=True)
    floors = Column(String, nullable=True)
    bathroomNumber = Column('bathroomnumber', Integer, nullable=True)
    description = Column(String, nullable=True)
    images = Column(JSONB, default=[])


class Car(BaseModel):
    id: uuid.UUID | None = None
    name: str
    brand: str
    model: str
    price: float
    mileage: int | None = None
    productionYear: int | None = None
    modelYear: int | None = None
    type: str | None = None
    driveType: str | None = None
    doorNumber: int | None = None
    seatNumber: int | None = None
    bodyShape: str | None = None
    registration: str | None = None
    engineSize: int | None = None
    location: str | None = None
    description: str | None = None
    power: int | None = None
    engine: str | None = None
    transmission: str | None = None
    consumption: float | None = None
    bodyColor: str | None = None
    interiorColor: str | None = None
    interiorMaterial: str | None = None
    emissionClass: str | None = None
    emission: int | None = None
    vin: str | None = None
    images: List[Image] = []

    model_config = {
        "from_attributes": True,
        "populate_by_name": True,
    }


class CarDB(Base):
    __tablename__ = "cars"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    brand = Column(String, nullable=False)
    model = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    mileage = Column(Integer, nullable=True)
    productionYear = Column('productionyear',Integer, nullable=True)
    type = Column(String, nullable=True)
    driveType = Column('drivetype',String, nullable=True)
    doorNumber = Column('doornumber',Integer, nullable=True)
    seatNumber = Column('seatnumber',Integer, nullable=True)
    bodyShape = Column('bodyshape',String, nullable=True)
    modelYear = Column('modelyear',Integer, nullable=True)
    registration = Column(String, nullable=True)
    engineSize = Column('enginesize',Integer, nullable=True)
    location = Column(String, nullable=True)
    description = Column(String, nullable=True)
    power = Column(Integer, nullable=True)
    engine = Column(String, nullable=True)
    transmission = Column(String, nullable=True)
    consumption = Column(Float, nullable=True)
    bodyColor = Column('bodycolor',String, nullable=True)
    interiorColor = Column('interiorcolor',String, nullable=True)
    interiorMaterial = Column('interiormaterial',String, nullable=True)
    emissionClass = Column('emissionclass',String, nullable=True)
    emission = Column(Integer, nullable=True)
    vin = Column(String, nullable=True)
    images = Column(JSONB, default=[])



class AllTablesResponse(BaseModel):
    cars: list[Car]
    buildings: list[Building]
    other: list[BasicObject]


class UserOffer(BaseModel):
    id: uuid.UUID | None = None
    objectId: str
    name: str
    email: str
    phone: str
    location: str | None
    description: str | None
    images: List[Image] = []
    model_config = {
        "from_attributes": True,
        "populate_by_name": True,
    }

class UserOfferDB(Base):
    __tablename__ = "user-offers"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    objectId = Column('objectid', UUID, nullable=False)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    location = Column(String, nullable=True)
    description = Column(String, nullable=True)
    images = Column(JSONB, default=[])




