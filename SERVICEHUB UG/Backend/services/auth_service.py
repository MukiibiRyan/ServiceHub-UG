"""Authentication business logic.

All DB access happens here (not in routes). Functions return serializable
results and raise ValueError for expected failures.
"""
from backend.database import db_config
import bcrypt
from backend import config

def hash_password(password: str) -> bytes:
    """Hash password using bcrypt."""
    # bcrypt expects bytes
    salt = bcrypt.gensalt(rounds=config.PASSWORD_HASH_ROUNDS)
    return bcrypt.hashpw(password.encode('utf-8'), salt)

def verify_password(password: str, hashed: bytes) -> bool:
    """Verify a plaintext password against bcrypt hash."""
    return bcrypt.checkpw(password.encode('utf-8'), hashed)

def register_user(username: str, email: str, password: str, role: str = 'client'):
    """Create a user record. Raises ValueError for validation errors."""
    if not username or not email or not password:
        raise ValueError('Missing required fields')
    if role not in ('client', 'technician', 'admin'):
        raise ValueError('Invalid role')

    conn = db_config.get_connection()
    try:
        cursor = conn.cursor()
        # Ensure email/username uniqueness
        cursor.execute('SELECT id FROM users WHERE email=%s OR username=%s', (email, username))
        if cursor.fetchone():
            raise ValueError('User with email or username already exists')

        pw_hash = hash_password(password)
        cursor.execute(
            'INSERT INTO users (username, email, password_hash, role) VALUES (%s,%s,%s,%s)',
            (username, email, pw_hash.decode('utf-8'), role)
        )
        conn.commit()
        user_id = cursor.lastrowid
        cursor.close()
        return {'id': user_id, 'username': username, 'email': email, 'role': role}
    finally:
        conn.close()

def login_user(email: str, password: str):
    """Authenticate user and return basic profile. Raises ValueError on failure."""
    if not email or not password:
        raise ValueError('Missing email or password')

    conn = db_config.get_connection()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT id, username, email, password_hash, role FROM users WHERE email=%s', (email,))
        row = cursor.fetchone()
        cursor.close()
        if not row:
            raise ValueError('Invalid credentials')

        hashed = row['password_hash'].encode('utf-8')
        if not verify_password(password, hashed):
            raise ValueError('Invalid credentials')

        # For simplicity, return user id and role. In production return JWT.
        return {'id': row['id'], 'username': row['username'], 'email': row['email'], 'role': row['role']}
    finally:
        conn.close()
