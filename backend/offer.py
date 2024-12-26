from typing import Annotated, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from auth import get_current_user
from models import Car, CarDB, ImageDB, Building, BuildingDB, Image, BasicObject, BasicObjectDB, \
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


    try:
        create_images(owner_id=new_car.id, owner_type="car", images=car_data.images, db=db)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

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


    try:
        create_images(owner_id=new_building.id, owner_type="building", images=building_data.images, db=db)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

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


    try:
        create_images(owner_id=new_basic_object.id, owner_type="basic_object", images=other_data.images, db=db)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

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

    try:
        create_images(owner_id=new_offer.id, owner_type="user_offer", images=offer_data.images, db=db)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

    db.commit()
    db.refresh(new_offer)

    return {"message": "Offer created successfully"}


@router.get("/vozila", response_model=List[Car])
async def get_cars(db: Annotated[Session, Depends(get_db)]) -> List[Car]:
    result = []
    cars = db.query(CarDB).options(joinedload(CarDB.images)).all()
    if not cars:
        raise HTTPException(status_code=404, detail="No cars found")
    for car in cars:
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
            images=car.images,
        )
        result.append(bo)

    return result

@router.get("/nekretnine", response_model=List[Building])
async def get_buildings(db: Annotated[Session, Depends(get_db)]) -> List[Building]:
    result = []
    buildings = db.query(BuildingDB).options(joinedload(BuildingDB.images)).all()
    if not buildings:
        raise HTTPException(status_code=404, detail="No buildings found")
    for building in buildings:
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
            images=building.images,
        )
        result.append(bo)

    return result

@router.get("/ostalo", response_model=List[BasicObject])
async def get_other(db: Annotated[Session, Depends(get_db)]) -> List[BasicObject]:
    result = []
    basic_objects = db.query(BasicObjectDB).options(joinedload(BasicObjectDB.images)).all()
    if not basic_objects:
        raise HTTPException(status_code=404, detail="No basic objects found")
    for basic_object in basic_objects:
        bo = BasicObject(
            id=str(basic_object.id),
            subject=basic_object.subject,
            price=basic_object.price,
            description=basic_object.description,
            images=basic_object.images,
        )
        result.append(bo)

    return result


@router.get("/ponude/{object_id}", response_model=List[UserOffer])
async def get_offers(object_id: str, db: Annotated[Session, Depends(get_db)]):
    result = []
    user_offers = db.query(UserOfferDB).filter(UserOfferDB.objectId == object_id).options(joinedload(UserOfferDB.images)).all()
    if not user_offers:
        raise HTTPException(status_code=404, detail="No user offers found")
    for user_offer in user_offers:
        bo = UserOffer(
            id=str(user_offer.id),
            objectId=str(user_offer.objectId),
            name=user_offer.name,
            email=user_offer.email,
            phone=user_offer.phone,
            location=user_offer.location,
            description=user_offer.description,
            images=user_offer.images,
        )
        result.append(bo)

    return result

@router.get("/", response_model=AllTablesResponse)
async def get_all(db: Annotated[Session, Depends(get_db)]):
    car_db_instances = db.query(CarDB).all()
    building_db_instances = db.query(BuildingDB).all()
    basic_object_db_instances = db.query(BasicObjectDB).all()

    if not car_db_instances and not building_db_instances and not basic_object_db_instances:
        raise HTTPException(status_code=404, detail="No data found")

    # Convert SQLAlchemy models to Pydantic models
    cars = [Car.model_validate(car) for car in car_db_instances]
    buildings = [Building.model_validate(building) for building in building_db_instances]
    other = [BasicObject.model_validate(obj) for obj in basic_object_db_instances]

    return AllTablesResponse(cars=cars, buildings=buildings, other=other)

@router.delete("/brisanje/vozilo/{vehicle_id}")
async def delete_vehicle(vehicle_id: str, db: Annotated[Session, Depends(get_db)]):
    vehicle = db.query(CarDB).filter(CarDB.id == vehicle_id).first()

    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    db.delete(vehicle)
    db.commit()

    return {"message": f"Vehicle with ID {vehicle_id} deleted successfully"}

@router.delete("/brisanje/nekretnina/{building_id}")
async def delete_building(building_id: str, db: Annotated[Session, Depends(get_db)]):
    building = db.query(BuildingDB).filter(BuildingDB.id == building_id).first()

    if not building:
        raise HTTPException(status_code=404, detail="Building not found")

    db.delete(building)
    db.commit()

    return {"message": f"Building with ID {building_id} deleted successfully"}

@router.delete("/brisanje/ostalo/{basic_object_id}")
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


@router.put("/uredi/nekretnina/{building_id}")
async def edit_building(
    building_id: str,
    updated_building: Building,
    db: Annotated[Session, Depends(get_db)]
):
    # Fetch the building
    building = db.query(BuildingDB).filter(BuildingDB.id == building_id).first()

    if not building:
        raise HTTPException(status_code=404, detail="Building not found")

    # Update building fields, excluding 'images'
    for key, value in updated_building.model_dump(exclude_unset=True).items():
        if key == 'images':
            continue  # Skip images; handle them separately
        if hasattr(building, key) and getattr(building, key) != value:
            setattr(building, key, value)

    # Handle images
    if hasattr(updated_building, "images") and updated_building.images is not None:
        # Fetch existing images from the database
        existing_images = db.query(ImageDB).filter(
            ImageDB.owner_id == building_id,
            ImageDB.owner_type == "building"
        ).all()

        # Create a set of existing image IDs for quick lookup
        existing_image_ids = {str(img.id) for img in existing_images}

        # Process the updated images
        for updated_image in updated_building.images:
            if updated_image.id not in existing_image_ids:
                # Image does not exist in the database; add it
                new_image = ImageDB(
                    id=updated_image.id,
                    full=updated_image.full,
                    small=updated_image.small,
                    owner_id=building_id,
                    owner_type="building"
                )
                db.add(new_image)
                building.images.append(new_image)
            else:
                # Image already exists; skip it
                pass  # Do not update existing images

        # Remove images that are not in the updated list
        updated_image_ids = {img.id for img in updated_building.images}
        images_to_delete = [img for img in existing_images if img.id not in updated_image_ids]
        for img in images_to_delete:
            db.delete(img)

    # Commit the transaction
    db.commit()
    db.refresh(building)

    return {"message": f"Building with ID {building_id} updated successfully"}




@router.put("/uredi/ostalo/{basic_object_id}")
async def edit_basic_object(
    basic_object_id: str,
    updated_basic_object: BasicObject,
    db: Annotated[Session, Depends(get_db)]
):
    # Fetch the basic object
    basic_object = db.query(BasicObjectDB).filter(BasicObjectDB.id == basic_object_id).first()

    if not basic_object:
        raise HTTPException(status_code=404, detail="Basic object not found")

    # Update basic object fields, excluding 'images'
    for key, value in updated_basic_object.model_dump(exclude_unset=True).items():
        if key == 'images':
            continue  # Skip images; handle them separately
        if hasattr(basic_object, key) and getattr(basic_object, key) != value:
            setattr(basic_object, key, value)

    # Handle images
    if hasattr(updated_basic_object, "images") and updated_basic_object.images is not None:
        # Fetch existing images from the database
        existing_images = db.query(ImageDB).filter(
            ImageDB.owner_id == basic_object_id,
            ImageDB.owner_type == "basic_object"
        ).all()

        # Create a set of existing image IDs for quick lookup
        existing_image_ids = {str(img.id) for img in existing_images}

        # Process the updated images
        for updated_image in updated_basic_object.images:
            if updated_image.id not in existing_image_ids:
                # Image does not exist in the database; add it
                new_image = ImageDB(
                    id=updated_image.id,
                    full=updated_image.full,
                    small=updated_image.small,
                    owner_id=basic_object_id,
                    owner_type="basic_object"
                )
                db.add(new_image)
                basic_object.images.append(new_image)
            else:
                # Image already exists; skip it
                pass  # Do not update existing images

        updated_image_ids = {img.id for img in updated_basic_object.images}
        images_to_delete = [img for img in existing_images if img.id not in updated_image_ids]
        for img in images_to_delete:
             db.delete(img)

    # Commit the transaction
    db.commit()
    db.refresh(basic_object)

    return {"message": f"Basic object with ID {basic_object_id} updated successfully"}



@router.put("/uredi/ponuda/{user_offer_id}")
async def edit_user_offer(
    user_offer_id: str,
    updated_user_offer: UserOffer,
    db: Annotated[Session, Depends(get_db)]
):
    # Fetch the user offer
    user_offer = db.query(UserOfferDB).filter(UserOfferDB.id == user_offer_id).first()

    if not user_offer:
        raise HTTPException(status_code=404, detail="User offer not found")

    # Update user offer fields, excluding 'images'
    for key, value in updated_user_offer.model_dump(exclude_unset=True).items():
        if key == 'images':
            continue  # Skip images; handle them separately
        if hasattr(user_offer, key) and getattr(user_offer, key) != value:
            setattr(user_offer, key, value)

    # Handle images
    if hasattr(updated_user_offer, "images") and updated_user_offer.images is not None:
        # Fetch existing images from the database
        existing_images = db.query(ImageDB).filter(
            ImageDB.owner_id == user_offer_id,
            ImageDB.owner_type == "user_offer"
        ).all()

        # Create a set of existing image IDs for quick lookup
        existing_image_ids = {str(img.id) for img in existing_images}

        # Process the updated images
        for updated_image in updated_user_offer.images:
            if updated_image.id not in existing_image_ids:
                # Image does not exist in the database; add it
                new_image = ImageDB(
                    id=updated_image.id,
                    full=updated_image.full,
                    small=updated_image.small,
                    owner_id=user_offer_id,
                    owner_type="user_offer"
                )
                db.add(new_image)
                user_offer.images.append(new_image)
            else:
                # Image already exists; skip it
                pass  # Do not update existing images

        # Remove images that are not in the updated list
        updated_image_ids = {img.id for img in updated_user_offer.images}
        images_to_delete = [img for img in existing_images if img.id not in updated_image_ids]
        for img in images_to_delete:
            db.delete(img)

    # Commit the transaction
    db.commit()
    db.refresh(user_offer)

    return {"message": f"User offer with ID {user_offer_id} updated successfully"}

@router.put("/uredi/vozilo/{vehicle_id}")
async def edit_vehicle(
    vehicle_id: str,
    updated_vehicle: Car,
    db: Annotated[Session, Depends(get_db)]
):
    # Fetch the vehicle
    vehicle = db.query(CarDB).filter(CarDB.id == vehicle_id).first()

    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    # Update vehicle fields, excluding 'images'
    for key, value in updated_vehicle.model_dump(exclude_unset=True).items():
        if key == 'images':
            continue  # Skip images; handle them separately
        if hasattr(vehicle, key) and getattr(vehicle, key) != value:
            setattr(vehicle, key, value)

    # Handle images
    if hasattr(updated_vehicle, "images") and updated_vehicle.images is not None:
        # Fetch existing images from the database
        existing_images = db.query(ImageDB).filter(
            ImageDB.owner_id == vehicle_id,
            ImageDB.owner_type == "car"
        ).all()

        # Create a set of existing image IDs for quick lookup
        existing_image_ids = {str(img.id) for img in existing_images}

        # Process the updated images
        for updated_image in updated_vehicle.images:
            if updated_image.id not in existing_image_ids:
                # Image does not exist in the database; add it
                new_image = ImageDB(
                    id=updated_image.id,
                    full=updated_image.full,
                    small=updated_image.small,
                    owner_id=vehicle_id,
                    owner_type="car"
                )
                db.add(new_image)
                vehicle.images.append(new_image)
            else:
                # Image already exists; skip it
                pass  # Do not update existing images

        # Remove images that are not in the updated list
        updated_image_ids = {img.id for img in updated_vehicle.images}
        images_to_delete = [img for img in existing_images if img.id not in updated_image_ids]
        for img in images_to_delete:
            db.delete(img)

    # Commit the transaction
    db.commit()
    db.refresh(vehicle)

    return {"message": f"Vehicle with ID {vehicle_id} updated successfully"}



def create_images(owner_id, owner_type, images: List[Image], db: Session):
    if not images:
        raise ValueError("No images provided for creation")

    try:
        for image in images:
            new_image = ImageDB(
                id=image.id,
                full=image.full,
                small=image.small,
                owner_id=owner_id,
                owner_type=owner_type
            )
            db.add(new_image)

        db.commit()
    except Exception as e:
        db.rollback()
        raise e


