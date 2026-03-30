"""Booking business logic.

Enforces business rules: cannot book technicians unless their payment_status is 'PAID'.
All DB access goes through db_config.
"""
from backend.database import db_config
from backend.services import technician_service

def create_booking(client_id: int, technician_id: int, service_id: int, scheduled_at: str, notes: str = None):
    """Create a booking/job. Raises ValueError if technician not eligible."""
    # Ensure technician is PAID
    tech = technician_service.get_technician(technician_id)
    if not tech:
        raise ValueError('Technician not found')
    if tech.get('payment_status') != 'PAID':
        raise ValueError('Technician is not paid and cannot be booked')

    conn = db_config.get_connection()
    try:
        cursor = conn.cursor()
        cursor.execute(
            'INSERT INTO jobs (client_id, technician_id, service_id, scheduled_at, status, notes) VALUES (%s,%s,%s,%s,%s,%s)',
            (client_id, technician_id, service_id, scheduled_at, 'PENDING', notes)
        )
        conn.commit()
        job_id = cursor.lastrowid
        cursor.close()
        return {'job_id': job_id, 'status': 'PENDING'}
    finally:
        conn.close()

def get_booking(job_id: int):
    conn = db_config.get_connection()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT * FROM jobs WHERE id=%s', (job_id,))
        row = cursor.fetchone()
        cursor.close()
        return row
    finally:
        conn.close()
