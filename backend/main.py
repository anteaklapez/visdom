from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import auth
import offer
import contact
import os

app = FastAPI()

app.include_router(auth.router)
app.include_router(offer.router)
app.include_router(contact.router)

origins = [
    "http://localhost:8080",
    "http://localhost:4200",
    "https://vis-dom.com",
    "https://www.vis-dom.com",
    "https://visdom.up.railway.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"]
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=os.getenv("HOST"), port=int(os.getenv("PORT")), reload=True)