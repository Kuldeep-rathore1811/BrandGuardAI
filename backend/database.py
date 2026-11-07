import os
import psycopg
from dotenv import load_dotenv

load_dotenv()


def get_connection():

    # Use Neon cloud database when DATABASE_URL is available
    database_url = os.getenv("DATABASE_URL")

    if database_url:
        return psycopg.connect(database_url)

    # Otherwise, use the local PostgreSQL database
    connection = psycopg.connect(
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT")
    )

    return connection