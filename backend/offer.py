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
    db.flush()


    create_images(new_car, "car", car_data.image, db)

    db.commit()
    db.refresh(new_car)

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
    db.flush()


    create_images(new_building, "building", building_data.image, db)

    db.commit()
    db.refresh(new_building)

    return {"message": "Building created successfully"}


@router.post("/izrada/ostalo", status_code=200)
async def create_other(other_data: BasicObject, db: Annotated[Session, Depends(get_db)]):
    new_basic_object = BasicObjectDB(
        subject=other_data.subject,
        price=other_data.price,
        description=other_data.description,
    )

    db.add(new_basic_object)
    db.flush()


    create_images(new_basic_object, "basic_object", other_data.image, db)

    db.commit()
    db.refresh(new_basic_object)

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
    db.flush()


    create_images(new_offer, "user_offer", offer_data.image, db)

    db.commit()
    db.refresh(new_offer)

    return {"message": "Offer created successfully"}


@router.get("/vozila", response_model=List[Car])
async def get_cars(db: Annotated[Session, Depends(get_db)]):
    result = []
    cars = db.query(CarDB).options(joinedload(CarDB.images)).all()
    for car in cars:
        bo = BasicObject(
            id=str(car.id),
            name=car.name,
            brand=car.brand,
            model=car.model,
            price=car.price,
            mileage=car.mileage,
            productionYear=car.productionYear,
            modelYear=car.modelYear,
            type=car.type,
            driveType=car.driveType,
            doorNumber=car.doorNumber,
            seatNumber=car.seatNumber,
            bodyShape=car.bodyShape,
            registration=car.registration,
            engineSize=car.engineSize,
            location=car.location,
            description=car.description,
            power=car.power,
            engine=car.engine,
            transmission=car.transmission,
            consumption=car.consumption,
            bodyColor=car.bodyColor,
            interiorColor=car.interiorColor,
            interiorMaterial=car.interiorMaterial,
            emissionClass=car.emissionClass,
            emission=car.emission,
            vin=car.vin,
            image=car.images,
        )
        result.append(bo)

    return result

@router.get("/nekretnine", response_model=List[Building])
async def get_buildings(db: Annotated[Session, Depends(get_db)]):
    result = []
    buildings = db.query(BuildingDB).options(joinedload(BuildingDB.images)).all()
    for building in buildings:
        bo = BasicObject(
            id=str(building.id),
            location=building.location,
            title=building.title,
            price=building.price,
            roomNumber=building.roomNumber,
            buildingArea=building.buildingArea,
            gardenArea=building.gardenArea,
            buildYear=building.buildYear,
            buildingType=building.buildingType,
            floors=building.floors,
            bathroomNumber=building.bathroomNumber,
            description=building.description,
            image=building.images,
        )
        result.append(bo)

    return result

@router.get("/ostalo", response_model=List[BasicObject])
async def get_other(db: Annotated[Session, Depends(get_db)]):
    result = []
    basic_objects = db.query(BasicObjectDB).options(joinedload(BasicObjectDB.images)).all()
    for basic_object in basic_objects:
        bo = BasicObject(
            id=str(basic_object.id),
            subject=basic_object.subject,
            price=basic_object.price,
            description=basic_object.description,
            image=basic_object.images,
        )
        result.append(bo)

    return result


@router.get("/ponude/", response_model=List[UserOffer])
async def get_offers(object_id: str, db: Annotated[Session, Depends(get_db)]):
    result = []
    user_offers = db.query(UserOfferDB).filter(UserOfferDB.objectId == object_id).options(joinedload(UserOfferDB.images)).all()
    for user_offer in user_offers:
        print(user_offer.images[0].id)
        bo = BasicObject(
            id=str(user_offer.id),
            objectId=str(user_offer.id),
            name=user_offer.name,
            email=user_offer.email,
            phone=user_offer.phone,
            location=user_offer.location,
            description=user_offer.description,
            image=user_offer.images,
        )
        result.append(bo)

    return result

@router.get("/", response_model=AllTablesResponse)
async def get_all(db: Annotated[Session, Depends(get_db)]):
    cars = db.query(CarDB).all()
    buildings = db.query(BuildingDB).all()
    other = db.query(BasicObjectDB).all()

    return AllTablesResponse(cars=cars, buildings=buildings, other=other)

def create_images(data, owner_type, images: List[Image], db: Session):
    for image in images:
        new_image = ImageDB(
            id=image.id,
            full=image.full,
            small=image.small,
            owner_id=data.id,
            owner_type=owner_type
        )
        db.add(new_image)
        db.commit()
        db.refresh(new_image)

