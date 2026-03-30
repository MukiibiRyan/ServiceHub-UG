from flask import Blueprint, request, jsonify, g
from backend.services import payment_service
from backend.middleware.auth_middleware import auth_required
from backend.middleware.role_middleware import role_required

bp = Blueprint('payments', __name__, url_prefix='/payments')


@bp.route('/process', methods=['POST'])
@auth_required
@role_required('admin')
def process_payment():
    data = request.get_json() or {}
    technician_id = data.get('technician_id')
    amount_cents = data.get('amount_cents', 0)
    if not technician_id or amount_cents <= 0:
        return jsonify({'error': 'Invalid payload'}), 400
    result = payment_service.process_payment_for_technician(technician_id, amount_cents)
    return jsonify(result), 200
