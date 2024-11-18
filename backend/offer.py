from typing import Annotated, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload

from backend.auth import get_current_user
from backend.models import Car, CarDB, ImageDB, Building, BuildingDB, Image, BasicObject, BasicObjectDB, \
    AllTablesResponse, UserOfferDB, UserOffer
from database import get_db

router = APIRouter(
    dependencies=[Depends(get_current_user)]
)

@router.post("/izrada/vozila", status_code=200)
async def create_vehicle(car_data: Car, db: Annotated[Session, Depends(get_db)]):
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

    return {"message": "Car created successfully"}

@router.post("/izrada/nekretnine", status_code=200)
async def create_building(building_data: Building, db: Annotated[Session, Depends(get_db)]):
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

    return {"message": "Building created successfully"}


@router.post("/izrada/ostalo", status_code=200)
async def create_other(other_data: BasicObject, db: Annotated[Session, Depends(get_db)]):
    new_basic_object = BasicObjectDB(
        subject=other_data.subject,
        price=other_data.price,
        description=other_data.description,
    )

    db.add(new_basic_object)
    db.commit()
    db.refresh(new_basic_object)

    create_images(new_basic_object, other_data.image, db)

    return {"message": "Other created successfully"}


@router.post("/izrada/ponuda", status_code=200)
async def create_offer(offer_data: UserOffer, db: Annotated[Session, Depends(get_db)]):
    new_offer = UserOfferDB(
        objectId=offer_data.objectId,
        name=offer_data.name,
        email=offer_data.email,
        phone=offer_data.phone,
        location=offer_data.location,
        description=offer_data.description
    )

    db.add(new_offer)
    db.commit()
    db.refresh(new_offer)

    create_images(new_offer, offer_data.image, db)

    return {"message": "Offer created successfully"}


@router.get("/vozila", response_model=List[Car])
async def get_cars(db: Annotated[Session, Depends(get_db)]):
    return db.query(CarDB).all()

@router.get("/nekretnine", response_model=List[Building])
async def get_buildings(db: Annotated[Session, Depends(get_db)]):
    return db.query(BuildingDB).all()

@router.get("/ostalo", response_model=List[BasicObject])
async def get_other(db: Annotated[Session, Depends(get_db)]):
    basic_objects = db.query(BasicObjectDB).options(joinedload(BasicObjectDB.images)).all()

    return basic_objects

@router.get("/ponude/", response_model=List[UserOffer])
async def get_offers(object_id: str, db: Annotated[Session, Depends(get_db)]):
    offers = db.query(UserOfferDB).filter(UserOfferDB.objectId == object_id).all()
    return offers

@router.get("/", response_model=AllTablesResponse)
async def get_all(db: Annotated[Session, Depends(get_db)]):
    cars = db.query(CarDB).all()
    buildings = db.query(BuildingDB).all()
    other = db.query(BasicObjectDB).all()

    return AllTablesResponse(cars=cars, buildings=buildings, other=other)

def create_images(data, images: List[Image], db: Session):
    for image in images:
        new_image = ImageDB(
            id=image.id,
            full=image.full,
            small=image.small,
            owner_id=data.id,
        )
        db.add(new_image)
        db.commit()
        db.refresh(new_image)

