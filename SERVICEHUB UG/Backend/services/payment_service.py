"""Payment business logic.

Simulates payment processing and updates technician payment_status.
In a real system this would integrate with a payment gateway.
"""
from backend.database import db_config
from backend.services import technician_service

def process_payment_for_technician(technician_id: int, amount_cents: int, payment_method: str = 'card'):
    """Simulate a payment. On success update technician to PAID and create a payment record."""
    # Simulate success for demo purposes
    success = True
    conn = db_config.get_connection()
    try:
        cursor = conn.cursor()
        # Insert payment record
        status = 'SUCCESS' if success else 'FAILED'
        cursor.execute('INSERT INTO payments (technician_id, amount_cents, status, method) VALUES (%s,%s,%s,%s)', (technician_id, amount_cents, status, payment_method))
        payment_id = cursor.lastrowid
        # If success, update technician
        if success:
            cursor.execute('UPDATE technicians SET payment_status=%s WHERE id=%s', ('PAID', technician_id))
        conn.commit()
        cursor.close()
        return {'payment_id': payment_id, 'status': status}
    finally:
        conn.close()
