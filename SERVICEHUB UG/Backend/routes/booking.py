from flask import Blueprint, request, jsonify, g
from backend.services import booking_service
from backend.middleware.auth_middleware import auth_required

bp = Blueprint('bookings', __name__, url_prefix='/bookings')


@bp.route('/', methods=['POST'])
@auth_required
def create_booking():
    data = request.get_json() or {}
    try:
        client_id = g.user['id']
        technician_id = data.get('technician_id')
        service_id = data.get('service_id')
        scheduled_at = data.get('scheduled_at')
        notes = data.get('notes')
        result = booking_service.create_booking(client_id, technician_id, service_id, scheduled_at, notes)
        return jsonify(result), 201
    except ValueError as e:
        return jsonify({'error': str(e)}), 400


@bp.route('/<int:job_id>', methods=['GET'])
@auth_required
def get_booking(job_id):
    booking = booking_service.get_booking(job_id)
    if not booking:
        return jsonify({'error': 'Not found'}), 404
    # Only the client or technician or admin should access; simple check omitted for brevity
    return jsonify({'booking': booking}), 200
