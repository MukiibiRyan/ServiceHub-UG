from flask import Blueprint, request, jsonify
from backend.services import auth_service

bp = Blueprint('auth', __name__, url_prefix='/auth')


@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    try:
        user = auth_service.register_user(
            username=data.get('username'),
            email=data.get('email'),
            password=data.get('password'),
            role=data.get('role', 'client')
        )
        return jsonify({'user': user}), 201
    except ValueError as e:
        return jsonify({'error': str(e)}), 400


@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    try:
        user = auth_service.login_user(email=data.get('email'), password=data.get('password'))
        # In production, return JWT. Here return user profile and ask client to set X-User-Id header.
        return jsonify({'user': user}), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
