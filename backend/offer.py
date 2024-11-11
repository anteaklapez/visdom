from typing import Annotated, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.models import Car, CarDB, ImageDB, Building, BuildingDB, Image, BasicObject, BasicObjectDB, AllTablesResponse
from database import get_db

router = APIRouter()

@router.post("/izrada/vozila")
async def create_vehicle(car_data: Car, db: Annotated[Session, Depends(get_db())]):
    new_car = CarDB(
        name=car_data.name,
        brand=car_data.brand,
        model=car_data.model,
        price=car_data.price,
        mileage=car_data.mileage,
        productionYear=car_data.productionYear,
        modelYear=car_data.modelYear,
        type=car_data.type,
        driveType=car_data.driveType,
        doorNumber=car_data.doorNumber,
        seatNumber=car_data.seatNumber,
        bodyShape=car_data.bodyShape,
        registration=car_data.registration,
        engineSize=car_data.engineSize,
        location=car_data.location,
        description=car_data.description,
        power=car_data.power,
        engine=car_data.engine,
        transmission=car_data.transmission,
        consumption=car_data.consumption,
        bodyColor=car_data.bodyColor,
        interiorColor=car_data.interiorColor,
        interiorMaterial=car_data.interiorMaterial,
        emissionClass=car_data.emissionClass,
        emission=car_data.emission,
        vin=car_data.vin
    )

    db.add(new_car)
    db.commit()
    db.refresh(new_car)

    create_images(new_car, car_data.image, db)

    return new_car

@router.post("/izrada/nekretnine")
async def create_building(building_data: Building, db: Annotated[Session, Depends(get_db())]):
    new_building = BuildingDB(
        location=building_data.location,
        title=building_data.title,
        price=building_data.price,
        roomNumber=building_data.roomNumber,
        buildingArea=building_data.buildingArea,
        gardenArea=building_data.gardenArea,
        buildYear=building_data.buildYear,
        buildingType=building_data.buildingType,
        floors=building_data.floors,
        bathroomNumber=building_data.bathroomNumber,
        description=building_data.description,
    )

    db.add(new_building)
    db.commit()
    db.refresh(new_building)

    create_images(new_building, building_data.image, db)

    return new_building

@router.post("/izrada/ostalo")
async def create_other(other_data: BasicObject, db: Annotated[Session, Depends(get_db())]):
    new_basic_object = BasicObjectDB(
        subject=other_data.subject,
        price=other_data.price,
        description=other_data.description,
    )

    db.add(new_basic_object)
    db.commit()
    db.refresh(new_basic_object)

    create_images(new_basic_object, other_data.image, db)

    return new_basic_object


@router.get("/vozila", response_model=List[CarDB])
async def get_cars(db: Annotated[Session, Depends(get_db())]):
    return db.query(CarDB).all()

@router.get("/nekretnine", response_model=List[BuildingDB])
async def get_buildings(db: Annotated[Session, Depends(get_db())]):
    return db.query(BuildingDB).all()

@router.get("/ostalo", response_model=List[BasicObjectDB])
async def get_other(db: Annotated[Session, Depends(get_db())]):
    return db.query(BasicObjectDB).all()

@router.get("/")
async def get_all(db: Annotated[Session, Depends(get_db())]):
    cars = db.query(CarDB).all()
    buildings = db.query(BuildingDB).all()
    other = db.query(BasicObjectDB).all()

    return AllTablesResponse(cars=cars, buildings=buildings, other=other)

def create_images(data, images: List[Image], db: Session):
    for image in images:
        new_image = ImageDB(id=image.id, full=image.full, small=image.small)
        db.add(new_image)
        db.commit()
        db.refresh(new_image)
        data.images.set([new_image])

    db.commit()
