"""Technician business logic.

Provides functions to list technicians (only PAID), update payment status,
and fetch single technician details.
"""
from backend.database import db_config

def list_paid_technicians():
    """Return list of technicians whose payment_status = 'PAID'."""
    conn = db_config.get_connection()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id, user_id, skills, rating, location, bio, payment_status FROM technicians WHERE payment_status='PAID'")
        rows = cursor.fetchall()
        cursor.close()
        return rows
    finally:
        conn.close()

def get_technician(technician_id: int):
    conn = db_config.get_connection()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT id, user_id, skills, rating, location, bio, payment_status FROM technicians WHERE id=%s', (technician_id,))
        row = cursor.fetchone()
        cursor.close()
        return row
    finally:
        conn.close()

def set_payment_status(technician_id: int, status: str):
    if status not in ('PENDING','PAID','FAILED'):
        raise ValueError('Invalid status')
    conn = db_config.get_connection()
    try:
        cursor = conn.cursor()
        cursor.execute('UPDATE technicians SET payment_status=%s WHERE id=%s', (status, technician_id))
        conn.commit()
        cursor.close()
        return True
    finally:
        conn.close()
