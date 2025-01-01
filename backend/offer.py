from typing import Annotated, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from auth import get_current_user
from models import Car, CarDB, Building, BuildingDB, Image, BasicObject, BasicObjectDB, \
    AllTablesResponse, UserOfferDB, UserOffer
from database import get_db

router = APIRouter()

@router.post("/izrada/vozila", status_code=200, dependencies=[Depends(get_current_user)])
async def create_vehicle(car_data: Car, db: Annotated[Session, Depends(get_db)]):
    images_json = [image.model_dump() for image in car_data.images] if car_data.images else []

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
        vin=car_data.vin,
        images=images_json
    )

    db.add(new_car)
    db.commit()
    db.refresh(new_car)

    return {"message": "Car created successfully"}

@router.post("/izrada/nekretnine", status_code=200, dependencies=[Depends(get_current_user)])
async def create_building(building_data: Building, db: Annotated[Session, Depends(get_db)]):
    images_json = [image.model_dump() for image in building_data.images] if building_data.images else []

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
        images=images_json
    )

    db.add(new_building)
    db.commit()
    db.refresh(new_building)

    return {"message": "Building created successfully"}


@router.post("/izrada/ostalo", status_code=200, dependencies=[Depends(get_current_user)])
async def create_other(other_data: BasicObject, db: Annotated[Session, Depends(get_db)]):
    images_json = [image.model_dump() for image in other_data.images] if other_data.images else []

    new_basic_object = BasicObjectDB(
        subject=other_data.subject,
        price=other_data.price,
        description=other_data.description,
        images=images_json
    )

    db.add(new_basic_object)
    db.commit()
    db.refresh(new_basic_object)

    return {"message": "Other created successfully"}


@router.post("/izrada/ponuda", status_code=200)
async def create_offer(offer_data: UserOffer, db: Annotated[Session, Depends(get_db)]):
    images_json = [image.model_dump() for image in offer_data.images] if offer_data.images else []

    new_offer = UserOfferDB(
        objectId=offer_data.objectId,
        name=offer_data.name,
        email=offer_data.email,
        phone=offer_data.phone,
        location=offer_data.location,
        description=offer_data.description,
        images=images_json
    )

    db.add(new_offer)
    db.commit()
    db.refresh(new_offer)

    return {"message": "Offer created successfully"}


@router.get("/vozila", response_model=List[Car])
async def get_cars(db: Annotated[Session, Depends(get_db)]) -> List[Car]:
    result = []
    cars = db.query(CarDB).all()

    if not cars:
        return []
    for car in cars:
        images = [Image(**image) for image in car.images] if car.images else []

        bo = Car(
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
            images=images,
        )
        result.append(bo)

    return result

@router.get("/nekretnine", response_model=List[Building])
async def get_buildings(db: Annotated[Session, Depends(get_db)]) -> List[Building]:
    result = []
    buildings = db.query(BuildingDB).all()
    if not buildings:
        return []
    for building in buildings:
        images = [Image(**image) for image in building.images] if building.images else []

        bo = Building(
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
            images=images,
        )
        result.append(bo)

    return result

@router.get("/ostalo", response_model=List[BasicObject])
async def get_other(db: Annotated[Session, Depends(get_db)]) -> List[BasicObject]:
    result = []
    basic_objects = db.query(BasicObjectDB).all()
    if not basic_objects:
        return []
    for basic_object in basic_objects:
        images = [Image(**image) for image in basic_object.images] if basic_object.images else []

        bo = BasicObject(
            id=str(basic_object.id),
            subject=basic_object.subject,
            price=basic_object.price,
            description=basic_object.description,
            images=images,
        )
        result.append(bo)

    return result


@router.get("/ponude/{object_id}", response_model=List[UserOffer])
async def get_offers(object_id: str, db: Annotated[Session, Depends(get_db)]):
    result = []
    user_offers = db.query(UserOfferDB).filter(UserOfferDB.objectId == object_id).all()
    if not user_offers:
        return []
    for user_offer in user_offers:
        images = [Image(**image) for image in user_offer.images] if user_offer.images else []

        bo = UserOffer(
            id=str(user_offer.id),
            objectId=str(user_offer.objectId),
            name=user_offer.name,
            email=user_offer.email,
            phone=user_offer.phone,
            location=user_offer.location,
            description=user_offer.description,
            images=images,
        )
        result.append(bo)

    return result

@router.get("/", response_model=AllTablesResponse)
async def get_all(db: Annotated[Session, Depends(get_db)]):
    car_db_instances = db.query(CarDB).all()
    building_db_instances = db.query(BuildingDB).all()
    basic_object_db_instances = db.query(BasicObjectDB).all()

    if not car_db_instances and not building_db_instances and not basic_object_db_instances:
        return AllTablesResponse(cars=[], buildings=[], other=[])

    # Convert SQLAlchemy models to Pydantic models
    cars = [Car.model_validate(car) for car in car_db_instances]
    buildings = [Building.model_validate(building) for building in building_db_instances]
    other = [BasicObject.model_validate(obj) for obj in basic_object_db_instances]

    return AllTablesResponse(cars=cars, buildings=buildings, other=other)

@router.delete("/brisanje/vozilo/{vehicle_id}", dependencies=[Depends(get_current_user)])
async def delete_vehicle(vehicle_id: str, db: Annotated[Session, Depends(get_db)]):
    vehicle = db.query(CarDB).filter(CarDB.id == vehicle_id).first()

    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    db.delete(vehicle)
    db.commit()

    return {"message": f"Vehicle with ID {vehicle_id} deleted successfully"}

@router.delete("/brisanje/nekretnina/{building_id}", dependencies=[Depends(get_current_user)])
async def delete_building(building_id: str, db: Annotated[Session, Depends(get_db)]):
    building = db.query(BuildingDB).filter(BuildingDB.id == building_id).first()

    if not building:
        raise HTTPException(status_code=404, detail="Building not found")

    db.delete(building)
    db.commit()

    return {"message": f"Building with ID {building_id} deleted successfully"}

@router.delete("/brisanje/ostalo/{basic_object_id}", dependencies=[Depends(get_current_user)])
async def delete_other(basic_object_id: str, db: Annotated[Session, Depends(get_db)]):
    other = db.query(BasicObjectDB).filter(BasicObjectDB.id == basic_object_id).first()

    if not other:
        raise HTTPException(status_code=404, detail="Basic object not found")

    db.delete(other)
    db.commit()

    return {"message": f"Basic object with ID {basic_object_id} deleted successfully"}

@router.delete("/brisanje/ponuda/{user_offer_id}")
async def delete_user_offer(user_offer_id: str, db: Annotated[Session, Depends(get_db)]):
    user_offer = db.query(UserOfferDB).filter(UserOfferDB.id == user_offer_id).first()

    if not user_offer:
        raise HTTPException(status_code=404, detail="User offer not found")

    db.delete(user_offer)
    db.commit()

    return {"message": f"User offer with ID {user_offer_id} deleted successfully"}


@router.put("/uredi/nekretnina/{building_id}", dependencies=[Depends(get_current_user)])
async def edit_building(
    building_id: str,
    updated_building: Building,
    db: Annotated[Session, Depends(get_db)]
):
    # Fetch the building
    building = db.query(BuildingDB).filter(BuildingDB.id == building_id).first()

    if not building:
        raise HTTPException(status_code=404, detail="Building not found")

    # Update building fields, including 'images'
    for key, value in updated_building.model_dump(exclude_unset=True).items():
        if key == "images":
            # Directly assign the images if they are already dictionaries
            building.images = value  # value is expected to be a list of dictionaries
        else:
            # Update other fields
            if hasattr(building, key) and getattr(building, key) != value:
                setattr(building, key, value)

    # Commit the transaction
    db.commit()
    db.refresh(building)

    return {"message": f"Building with ID {building_id} updated successfully"}






@router.put("/uredi/ostalo/{basic_object_id}", dependencies=[Depends(get_current_user)])
async def edit_basic_object(
    basic_object_id: str,
    updated_basic_object: BasicObject,
    db: Annotated[Session, Depends(get_db)]
):
    # Fetch the basic object
    basic_object = db.query(BasicObjectDB).filter(BasicObjectDB.id == basic_object_id).first()

    if not basic_object:
        raise HTTPException(status_code=404, detail="Basic object not found")

    # Update basic object fields, including 'images'
    for key, value in updated_basic_object.model_dump(exclude_unset=True).items():
        if key == "images":
            # Directly assign the images if they are already dictionaries
            basic_object.images = value  # value is expected to be a list of dictionaries
        else:
            # Update other fields
            if hasattr(basic_object, key) and getattr(basic_object, key) != value:
                setattr(basic_object, key, value)

    # Commit the transaction
    db.commit()
    db.refresh(basic_object)

    return {"message": f"Basic object with ID {basic_object_id} updated successfully"}




@router.put("/uredi/ponuda/{user_offer_id}", dependencies=[Depends(get_current_user)])
async def edit_user_offer(
    user_offer_id: str,
    updated_user_offer: UserOffer,
    db: Annotated[Session, Depends(get_db)]
):
    # Fetch the user offer
    user_offer = db.query(UserOfferDB).filter(UserOfferDB.id == user_offer_id).first()

    if not user_offer:
        raise HTTPException(status_code=404, detail="User offer not found")

    # Update user offer fields, including 'images'
    for key, value in updated_user_offer.model_dump(exclude_unset=True).items():
        if key == "images":
            # Directly assign the images if they are already dictionaries
            user_offer.images = value  # value is expected to be a list of dictionaries
        else:
            # Update other fields
            if hasattr(user_offer, key) and getattr(user_offer, key) != value:
                setattr(user_offer, key, value)

    # Commit the transaction
    db.commit()
    db.refresh(user_offer)

    return {"message": f"User offer with ID {user_offer_id} updated successfully"}




@router.put("/uredi/vozilo/{vehicle_id}", dependencies=[Depends(get_current_user)])
async def edit_vehicle(
    vehicle_id: str,
    updated_vehicle: Car,
    db: Annotated[Session, Depends(get_db)]
):
    # Fetch the vehicle
    vehicle = db.query(CarDB).filter(CarDB.id == vehicle_id).first()

    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    # Update vehicle fields, including 'images'
    for key, value in updated_vehicle.model_dump(exclude_unset=True).items():
        if key == "images":
            # Directly assign the images if they are already dictionaries
            vehicle.images = value  # value is expected to be a list of dictionaries
        else:
            # Update other fields
            if hasattr(vehicle, key) and getattr(vehicle, key) != value:
                setattr(vehicle, key, value)

    # Commit the transaction
    db.commit()
    db.refresh(vehicle)

    return {"message": f"Vehicle with ID {vehicle_id} updated successfully"}



