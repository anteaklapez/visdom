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

class ImageDB(Base):
    __tablename__ = "images"
    id = Column(String, primary_key=True)
    full = Column(String, nullable=False)
    small = Column(String, nullable=False)

    owner_id = Column(UUID(as_uuid=True), nullable=False)
    owner_type = Column(String, nullable=False)  # Indicates which entity owns this image

    __mapper_args__ = {
        'polymorphic_on': owner_type,
        'polymorphic_identity': 'image'
    }


class BasicObject(BaseModel):
    id: str | None = None
    subject: str
    price: float
    description: str
    image: List[Image] = []

    model_config = {
        "from_attributes": True,
        "populate_by_name": True,
        "alias_generator": lambda field_name: "id_str" if field_name == "id" else field_name
    }




class BasicObjectDB(Base):
    __tablename__ = "basic_objects"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    subject = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    description = Column(String, nullable=False)

    images = relationship(
        "ImageDB",
        primaryjoin="and_(foreign(ImageDB.owner_id) == BasicObjectDB.id)",
        cascade = "all, delete-orphan",
        overlaps = "images"
    )

    @property
    def id_str(self):
        return str(self.id)

class Building(BaseModel):
    id: str | None = None
    location: str
    title: str
    price: float
    image: List[Image] = []
    roomNumber: int | None
    buildingArea: int | None
    gardenArea: int | None
    buildYear: int | None
    buildingType: str
    floors: str
    bathroomNumber: int | None
    description: str | None

    model_config = {
        "from_attributes": True,
        "populate_by_name": True,
        "alias_generator": lambda field_name: "id_str" if field_name == "id" else field_name
    }

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
    floors = Column(String, nullable=True)
    bathroomNumber = Column(Integer, nullable=True)
    description = Column(String, nullable=True)

    images = relationship(
        "ImageDB",
        primaryjoin="and_(foreign(ImageDB.owner_id) == BuildingDB.id, ImageDB.owner_type == 'building')",
        cascade="all, delete-orphan",
        overlaps="images"
    )

    @property
    def id_str(self):
        return str(self.id)

class Car(BaseModel):
    id: str | None = None
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
        "alias_generator": lambda field_name: "id_str" if field_name == "id" else field_name
    }


class CarDB(Base):
    __tablename__ = "cars"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    brand = Column(String, nullable=False)
    model = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    mileage = Column(Integer, nullable=True)
    productionYear = Column(Integer, nullable=True)
    type = Column(String, nullable=True)
    driveType = Column(String, nullable=True)
    doorNumber = Column(Integer, nullable=True)
    seatNumber = Column(Integer, nullable=True)
    bodyShape = Column(String, nullable=True)
    modelYear = Column(Integer, nullable=True)
    registration = Column(String, nullable=True)
    engineSize = Column(Integer, nullable=True)
    location = Column(String, nullable=True)
    description = Column(String, nullable=True)
    power = Column(Integer, nullable=True)
    engine = Column(String, nullable=True)
    transmission = Column(String, nullable=True)
    consumption = Column(Float, nullable=True)
    bodyColor = Column(String, nullable=True)
    interiorColor = Column(String, nullable=True)
    interiorMaterial = Column(String, nullable=True)
    emissionClass = Column(String, nullable=True)
    emission = Column(Integer, nullable=True)
    vin = Column(String, nullable=True)

    images = relationship(
        "ImageDB",
        primaryjoin="and_(foreign(ImageDB.owner_id) == CarDB.id, ImageDB.owner_type == 'car')",
        cascade="all, delete-orphan",
        overlaps="images"
    )

    @property
    def id_str(self):
        return str(self.id)


class AllTablesResponse(BaseModel):
    cars: list[Car]
    buildings: list[Building]
    other: list[BasicObject]


class UserOffer(BaseModel):
    id: str
    objectId: str
    name: str
    email: str
    phone: str
    location: str
    description: str
    image: List[Image] = []
    model_config = {
        "from_attributes": True,
        "populate_by_name": True,
        "alias_generator": lambda field_name: "id_str" if field_name == "id" else field_name
    }

class UserOfferDB(Base):
    __tablename__ = "user-offers"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    objectId = Column(UUID, nullable=False)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    location = Column(String, nullable=True)
    description = Column(String, nullable=True)

    images = relationship(
        "ImageDB",
        primaryjoin="and_(foreign(ImageDB.owner_id) == UserOfferDB.id, ImageDB.owner_type == 'user_offer')",
        cascade="all, delete-orphan",
        overlaps="images"
    )

    @property
    def id_str(self):
        return str(self.id)


# Automation Function
def create_image_subclass(entity_name: str):
    return type(
        f"{entity_name.capitalize()}ImageDB",  # Class name
        (ImageDB,),  # Base class
        {
            "__mapper_args__": {
                "polymorphic_identity": entity_name  # Polymorphic identity
            }
        },
    )

# Dynamically Create Subclasses
BasicObjectImageDB = create_image_subclass("basic_object")
CarImageDB = create_image_subclass("car")
BuildingImageDB = create_image_subclass("building")
UserOfferImageDB = create_image_subclass("user_offer")




