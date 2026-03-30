"""Application configuration.

This module stores configuration constants. In production, use environment
variables and a secrets manager. Defaults here are safe for local testing.
"""
import os

# Flask settings
DEBUG = os.getenv('DEBUG', 'True') == 'True'
SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret')

# MySQL connection settings (used by db_config)
DB_HOST = os.getenv('DB_HOST', '127.0.0.1')
DB_PORT = int(os.getenv('DB_PORT', 3306))
DB_USER = os.getenv('DB_USER', 'root')
DB_PASSWORD = os.getenv('DB_PASSWORD', '')
DB_NAME = os.getenv('DB_NAME', 'servicehub')

# Bcrypt rounds for password hashing
PASSWORD_HASH_ROUNDS = int(os.getenv('BCRYPT_ROUNDS', 12))
