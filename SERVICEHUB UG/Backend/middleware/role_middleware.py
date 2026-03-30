from functools import wraps
from flask import g, jsonify

def role_required(*roles):
    """Decorator to enforce that `g.user['role']` is in allowed roles."""
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            user = getattr(g, 'user', None)
            if not user:
                return jsonify({'error': 'Authentication required'}), 401
            if user.get('role') not in roles:
                return jsonify({'error': 'Forbidden'}), 403
            return f(*args, **kwargs)
        return wrapper
    return decorator
