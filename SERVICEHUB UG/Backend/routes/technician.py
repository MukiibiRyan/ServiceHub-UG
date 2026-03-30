from flask import Blueprint, jsonify
from backend.services import technician_service

bp = Blueprint('technicians', __name__, url_prefix='/technicians')


@bp.route('/', methods=['GET'])
def list_technicians():
    techs = technician_service.list_paid_technicians()
    return jsonify({'technicians': techs}), 200


@bp.route('/<int:technician_id>', methods=['GET'])
def get_technician(technician_id):
    tech = technician_service.get_technician(technician_id)
    if not tech:
        return jsonify({'error': 'Not found'}), 404
    return jsonify({'technician': tech}), 200
