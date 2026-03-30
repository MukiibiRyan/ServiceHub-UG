from functools import wraps
from flask import request, g, jsonify
from backend.database import db_config

def auth_required(f):
    """Decorator to require a user. Expects header `X-User-Id` with user id.

    This is a simple development-friendly approach. In production use JWTs.
    """
    @wraps(f)
    def wrapper(*args, **kwargs):
        user_id = request.headers.get('X-User-Id')
        if not user_id:
            return jsonify({'error': 'Authentication required'}), 401
        # load user from DB
        conn = db_config.get_connection()
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute('SELECT id, username, email, role FROM users WHERE id=%s', (user_id,))
            user = cursor.fetchone()
            cursor.close()
        finally:
            conn.close()
        if not user:
            return jsonify({'error': 'Invalid user'}), 401
        g.user = user
        return f(*args, **kwargs)
    return wrapper
