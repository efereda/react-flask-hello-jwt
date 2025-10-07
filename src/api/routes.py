# api/routes.py
from flask import Blueprint, request, jsonify
from api.models import db, User
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta

api = Blueprint('api', __name__)
bcrypt = Bcrypt()  # app.py hace bcrypt.init_app(app)

# === Hello (ejemplo) ===
@api.route('/hello', methods=['GET', 'POST'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend"
    }
    return jsonify(response_body), 200

# === Signup ===
@api.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    if not data:
        return jsonify({"msg": "Payload inválido"}), 400

    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({"msg": "Email y password son requeridos"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "Email ya registrado"}), 400

    # Hashear la contraseña
    pw_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(email=email, password=pw_hash, is_active=True)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "Usuario creado exitosamente"}), 201

# === Login ===
@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return jsonify({"msg": "Payload inválido"}), 400

    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({"msg": "Email y password son requeridos"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"msg": "Credenciales inválidas"}), 401

    # Verificar password
    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"msg": "Credenciales inválidas"}), 401

    # Crear token JWT (puedes ajustar expires_delta)
    access_token = create_access_token(identity=user.email, expires_delta=timedelta(hours=2))
    return jsonify({"token": access_token, "user": user.serialize()}), 200

# === Ruta privada (protegida) ===
@api.route('/private', methods=['GET'])
@jwt_required()
def private():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    # Devuelve info que quieras mostrar en /private
    return jsonify({
        "msg": f"Bienvenido {user.email}, accediste a la zona privada",
        "user": user.serialize()
    }), 200
