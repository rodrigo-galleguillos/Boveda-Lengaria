from database import get_connection;
import os
from werkzeug.utils import secure_filename
from flask import Flask, jsonify, request
from mysql.connector import Error
from flask_cors import CORS


app = Flask(__name__, static_folder='static')
CORS(app)

UPLOAD_FOLDER_IMG = 'static/assets/img'
UPLOAD_FOLDER_AUDIO = 'static/assets/audio'
#------- Ruta de configuraciones inicial. -------
@app.route('/api/login', methods=['POST'])
def login():
    datos = request.get_json()
    conn = get_connection()
    if conn:
        cursor = conn.cursor(dictionary=True)
        query = "SELECT id, nombre, rol FROM usuarios WHERE mail = %s AND contrasena = %s"
        cursor.execute(query, (datos.get('mail'), datos.get('contrasena')))
        usuario = cursor.fetchone()
        
        cursor.close()
        conn.close()
        
        if usuario:
            return jsonify({"status": "success", "user": usuario}), 200
        else:
            return jsonify({"error": "Usuario no encontrado"}), 401
    return jsonify({"error": "Error de conexión"}), 500

@app.route('/api/registro', methods=["POST"])
def registro():
    datos =request.json

    nombre = datos.get("nombre")
    apellido = datos.get("apellido")
    dni= datos.get("dni")
    mail = datos.get("mail")
    telefono = datos.get("telefono")
    contrasena = datos.get("contrasena")
    confirmacion = datos.get("confirmacion")
    pais = datos.get("pais")
    provincia = datos.get("provincia")
    ciudad = datos.get("ciudad")

    if contrasena != confirmacion:
        return jsonify({"error": "Las contraseñas no coinciden"}), 400
    
    if len(str(dni)) != 8:
        return jsonify({"error": "El DNI debe tener exactamente 8 caracteres"}), 400
    
    if mail.count('@') != 1:
        return jsonify({"error": "El correo electrónico debe contener exactamente un '@'"}), 400
    
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        sql = "INSERT INTO usuarios (nombre, apellido, dni, mail, telefono, contrasena, pais, provincia, ciudad) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
        cursor.execute(sql, (nombre, apellido, dni, mail, telefono, contrasena, pais, provincia, ciudad))
        conn.commit()
        return jsonify({"message": "Usuario registrado exitosamente"}), 201
    except Error as err:
        conn.rollback()
        
        if err.errno == 1062:  # Error de clave duplicada
            return jsonify({"error": "El correo electrónico o la caontraseña ya está registrado"}), 400
        return jsonify ({"error": "Error interno del servidor, intente nuevamente más tarde"}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
#-------  -------

# -------- Rutas de Entidad Principal (Figuras) -------
@app.route ('/api/inicio', methods = ["GET"])
def inicio():
    conn = get_connection()
    if conn:
        cursor = conn.cursor(dictionary=True)
        query = """
        SELECT p.id, p.nombre, p.precio, p.img, c.tipo, c.nombre AS nombre_categorias, c.path_audio FROM productos p
        INNER JOIN categorias c ON p.fk_categoria_id = c.id
        """
        cursor.execute(query)
        productos = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(productos)
    else:
        return jsonify({"error": "No se pudo conectar a la base de datos"}), 500

@app.route('/api/tarjetas/<int:id_figura>')
def cargar_tarjetas(id_figura):
    conn = get_connection ()
    if conn:
        cursor = conn.cursor(dictionary=True)
        query = """
        SELECT p.nombre, p.precio, p.img, descripcion, stock, c.tipo, c.nombre AS nombre_categorias FROM productos p
        INNER JOIN categorias c ON p.fk_categoria_id = c.id
        WHERE p.id = %s
        """
        cursor.execute(query, (id_figura,))
        tarjetas = cursor.fetchone()
        cursor.close()
        conn.close()
        if tarjetas:
            return jsonify(tarjetas)
        else:
            return jsonify({"error": "Producto no encontrado"}), 404

@app.route("/api/cargaproductos", methods=['POST', 'OPTIONS'])
def cargar_productos():
    if request.method == 'OPTIONS':
        return '', 204
        
    conn = None
    cursor = None
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        # 1. Extraemos texto
        nombre = request.form.get("nombre")
        descripcion = request.form.get("descripcion")
        precio = request.form.get("precio")
        stock = request.form.get("stock")
        nombre_cat = request.form.get("nombre_cat")
        tipo_cat = request.form.get("tipo_cat")

        # 2. Extraemos archivos (Asegurate que en React sea 'imagen' y 'audio')
        file_imagen = request.files.get("imagen") 
        file_audio = request.files.get("audio")

        # Procesar Imagen
        nombre_imagen = "default.png"
        if file_imagen:
            nombre_imagen = secure_filename(file_imagen.filename)
            file_imagen.save(os.path.join(UPLOAD_FOLDER_IMG, nombre_imagen))

        # Procesar Audio
        nombre_audio = "default.mp3"
        if file_audio:
            nombre_audio = secure_filename(file_audio.filename)
            file_audio.save(os.path.join(UPLOAD_FOLDER_AUDIO, nombre_audio))

        # 3. Lógica de Categoría
        sql_buscar = "SELECT id FROM categorias WHERE nombre = %s AND tipo = %s"
        cursor.execute(sql_buscar, (nombre_cat, tipo_cat))
        resultado = cursor.fetchone()

        if resultado is None:
            sql_insertar_cat = "INSERT INTO categorias (nombre, tipo, path_audio) VALUES (%s, %s, %s)"
            cursor.execute(sql_insertar_cat, (nombre_cat, tipo_cat, nombre_audio))
            id_categoria = cursor.lastrowid
        else:
            id_categoria = resultado['id']

        # 4. INSERT Corregido (Sin duplicar descripción y usando nombre_imagen)
        sql_insertar_producto = """
            INSERT INTO productos (nombre, descripcion, precio, stock, fk_categoria_id, img) 
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        # Pasamos las variables correctas
        cursor.execute(sql_insertar_producto, (nombre, descripcion, precio, stock, id_categoria, nombre_imagen))
        
        conn.commit()
        return jsonify({"message": "Reliquia forjada exitosamente", "img": nombre_imagen}), 201

    except Exception as e:
        if conn: conn.rollback()
        print(f"Error en la Bóveda: {e}") # Esto te dirá el error exacto en la consola
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()
#--------  -------

# -------- Ruta de configuración especial -------
@app.route('/api/datos', methods = ["POST"])
def cambiar_dato():

    permisosrol = request.json.get("permisosrol")
    if permisosrol != "admin":
        return jsonify({"error": "Permisos insuficientes"}), 403
    datos = request.get_json()
    
    # Sacamos el ID para el WHERE y lo quitamos de la bolsa de datos
    id_usuario = datos.pop('id_usuario', None)
    
    if not id_usuario:
        return jsonify({"error": "ID de usuario obligatorio"}), 400

    if not datos:
        return jsonify({"mensaje": "No se enviaron campos para modificar"}), 200

    # 2. Construcción Dinámica de la Query
    columnas_sql = [f"{campo} = %s" for campo in datos.keys()]
    query = f"UPDATE usuarios SET {', '.join(columnas_sql)} WHERE id = %s"
    
    # Los valores son los del JSON filtrado + el ID al final
    valores = list(datos.values())
    valores.append(id_usuario)

    # 3. Gestión de la Base de Datos (Cursor y Conexión)
    conn = None
    cursor = None
    try:
        conn = get_connection()
        cursor = conn.cursor()
        
        cursor.execute(query, valores)
        conn.commit() # ¡Guardamos los cambios físicamente!
        
        return jsonify({
            "status": "success",
            "mensaje": f"Usuario {id_usuario} actualizado con éxito",
            "campos_tocados": list(datos.keys())
        }), 200

    except Exception as e:
        if conn:
            conn.rollback() # Si algo falla, deshacemos para no romper la DB
        print(f"Error crítico: {e}")
        return jsonify({"error": "Error interno al actualizar"}), 500

    finally:
        # Cerramos para no agotar las conexiones del servidor
        if cursor:
            cursor.close()
        if conn:
            conn.close()
#--------  -------

if __name__ == '__main__':
    app.run(debug=True, port=5000)