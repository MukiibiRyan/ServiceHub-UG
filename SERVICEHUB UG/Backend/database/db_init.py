"""Database initialization helper.

Provides a simple function to create required tables for the exercise.
In production this would be managed with migrations (Alembic, Flyway, Liquibase).
"""
from backend.database import db_config

CREATE_TABLES_SQL = [
    # Users table (simple auth)
    """
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) UNIQUE,
        email VARCHAR(255) UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('client','technician','admin') NOT NULL DEFAULT 'client',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;
    """,

    # Technicians table
    """
    CREATE TABLE IF NOT EXISTS technicians (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL UNIQUE,
        bio TEXT,
        location VARCHAR(255),
        payment_status ENUM('UNPAID','PAID') DEFAULT 'UNPAID',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB;
    """,

    # Jobs table (bookings)
    """
    CREATE TABLE IF NOT EXISTS jobs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        client_id INT NOT NULL,
        technician_id INT NOT NULL,
        scheduled_time DATETIME NOT NULL,
        status ENUM('PENDING','ACCEPTED','IN_PROGRESS','COMPLETED','CANCELLED') DEFAULT 'PENDING',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (technician_id) REFERENCES technicians(id) ON DELETE CASCADE
    ) ENGINE=InnoDB;
    """,

    # Payments table
    """
    CREATE TABLE IF NOT EXISTS payments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        currency VARCHAR(10) DEFAULT 'UGX',
        method VARCHAR(50),
        status ENUM('PENDING','COMPLETED','FAILED') DEFAULT 'PENDING',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB;
    """,

    # Reviews table
    """
    CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        job_id INT NOT NULL,
        technician_id INT NOT NULL,
        client_id INT NOT NULL,
        rating TINYINT NOT NULL,
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
        FOREIGN KEY (technician_id) REFERENCES technicians(id) ON DELETE CASCADE,
        FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB;
    """
]

def init_db():
    """Create tables if they do not exist."""
    conn = db_config.get_connection()
    try:
        cursor = conn.cursor()
        for sql in CREATE_TABLES_SQL:
            cursor.execute(sql)
        cursor.close()
    finally:
        conn.close()

if __name__ == '__main__':
    init_db()
