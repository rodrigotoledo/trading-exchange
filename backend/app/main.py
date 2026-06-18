from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def read_root():
    return {"message": "Hello from trading-exchange!"}


def main():
    print("Hello from app!")


if __name__ == "__main__":
    main()
