from flask import Flask, jsonify
from backend import config
from backend.database import db_config


def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = config.SECRET_KEY
    app.config['DEBUG'] = config.DEBUG

    # Initialize DB pool
    db_config.init_pool()

    # Register blueprints
    from backend.routes import auth as auth_bp
    from backend.routes import technician as tech_bp
    from backend.routes import booking as booking_bp
    from backend.routes import payment as payment_bp

    app.register_blueprint(auth_bp.bp)
    app.register_blueprint(tech_bp.bp)
    app.register_blueprint(booking_bp.bp)
    app.register_blueprint(payment_bp.bp)

    @app.route('/health')
    def health():
        return jsonify({'status': 'ok'})

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=config.DEBUG)
