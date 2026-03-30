"""Database connection helper.

Creates a reusable MySQL connection pool and exposes a helper to obtain
connections. All services should import and use `get_connection()` to access
the database so we centralize credentials and pooling.
"""
import mysql.connector
from mysql.connector import pooling
from mysql.connector import Error
from backend import config

# Create a connection pool on module import. Services will call get_connection().
_pool = None

def init_pool():
    """Initialize a connection pool. Called on app startup."""
    global _pool
    if _pool is not None:
        return
    try:
        _pool = pooling.MySQLConnectionPool(
            pool_name="servicehub_pool",
            pool_size=5,
            host=config.DB_HOST,
            port=config.DB_PORT,
            user=config.DB_USER,
            password=config.DB_PASSWORD,
            database=config.DB_NAME,
            autocommit=True
        )
    except Error as e:
        # In production, use structured logging
        print("ERROR creating DB pool:", e)
        raise

def get_connection():
    """Return a connection from the pool. Ensure init_pool() called first."""
    if _pool is None:
        init_pool()
    return _pool.get_connection()
