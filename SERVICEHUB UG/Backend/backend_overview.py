"""This file explains the backend in simple terms:
the backend is a small Flask application that provides JSON APIs and is organized into clear layers so each part has one job —
`config.py` holds settings, 
`backend/database/db_config.py` creates a MySQL connection pool 
and `db_init.py` can create the minimal tables for testing.
Business rules and database access live in the `services` layer 
(for example `auth_service`, `technician_service`, `booking_service`, `payment_service`),
and routes under `backend/routes` only call those services and return JSON (so there is no SQL in route handlers). 
Lightweight middleware (`auth_middleware`, `role_middleware`) enforces a simple development auth flow using the `X-User-Id` header and checks roles;
in production you would replace this with JWTs. 
Passwords are hashed with bcrypt;
payments are simulated by `payment_service` which records a payment and updates a technician's `payment_status` to `PAID`;
the technicians API deliberately returns only technicians with `payment_status = 'PAID'`,
and the booking service rejects attempts to book unpaid technicians — this enforces the key business rule. 
The app factory in `app.py` initializes the DB pool and registers blueprints for auth, technicians, bookings, and payments;
to run locally install the Python deps, run `db_init.init_db()` against your MySQL instance,
then start the app with `python backend/app.py`
to try the endpoints on port 5000."""
