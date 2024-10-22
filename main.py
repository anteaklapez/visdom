from fastapi import FastAPI
import auth
app = FastAPI()

app.include_router(auth.router)


@app.get("/")
async def root():
    return "Hello"

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)