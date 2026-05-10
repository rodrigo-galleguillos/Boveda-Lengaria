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
UPLOAD_FOLDER_IMG_BANNER = 'static/assets/img/banners'
UPLOAD_FOLDER_AUDIO_BANNER = 'static/assets/audio/banners'
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
        SELECT 
            p.id, p.nombre, p.precio, p.img, 
            p.path_audio_producto, 
            c.tipo, c.nombre AS nombre_categorias, 
            CONCAT('banners/', c.path_audio) AS path_audio_banner 
        FROM productos p 
        INNER JOIN categorias c ON p.fk_categoria_id = c.id
        ORDER BY p.id DESC LIMIT 5
        """
        cursor.execute(query)
        productos = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(productos)
    else:
        return jsonify({"error": "No se pudo conectar a la base de datos"}), 500

@app.route('/api/tarjetas_de_categoria/<int:id_categoria>')
def cargar_tarjetas_de_categoria(id_categoria):
    conn = get_connection()
    if conn:
        cursor = conn.cursor(dictionary=True)
        query = """
        SELECT p.id, p.nombre, p.precio, p.img, p.descripcion, p.stock, p.path_audio_producto, c.tipo, c.nombre AS nombre_categorias FROM productos p
        INNER JOIN categorias c ON p.fk_categoria_id = c.id
        WHERE fk_categoria_id = %s
        """
        cursor.execute(query, (id_categoria,))
        tarjetas = cursor.fetchall()
        cursor.close()
        conn.close()
        if tarjetas:
            return jsonify(tarjetas)
        else:
            return jsonify({"error": "No se encontraron productos para esta categoría"}), 404

@app.route('/api/tarjetas/<int:id_figura>')
def cargar_tarjetas(id_figura):
    conn = get_connection ()
    if conn:
        cursor = conn.cursor(dictionary=True)
        query = """
        SELECT p.nombre, p.precio, p.img, p.descripcion, p.stock, p.path_audio_producto, c.tipo, c.nombre AS nombre_categorias FROM productos p
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

@app.route('/api/actualizarstock/<int:id_producto>', methods=['PUT'])
def actualizar_stock(id_producto):
    datos = request.get_json()
    nuevo_stock = datos.get('stock')

    if nuevo_stock is None:
        return jsonify({"error": "El campo 'stock' es obligatorio"}), 400

    conn = None
    cursor = None
    try:
        conn = get_connection()
        cursor = conn.cursor()
        
        sql_actualizar = "UPDATE productos SET precio = %s, stock = %s, descripcion = %s, img = %s, path_audio_producto = %s  WHERE id = %s"
        cursor.execute(sql_actualizar, (nuevo_stock, id_producto))
        conn.commit() # ¡No olvides guardar los cambios!

        if cursor.rowcount == 0:
            return jsonify({"error": "Producto no encontrado"}), 404
        
        return jsonify({"message": "Stock actualizado exitosamente"}), 200

    except Exception as e:
        if conn: conn.rollback() # Si algo falla, deshacemos para no romper la DB
        print(f"Error al actualizar stock: {e}")
        return jsonify({"error": "Error interno al actualizar stock"}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

@app.route('/api/categorias', methods=['GET'])
def cargar_categorias():
    conn = get_connection()
    if conn:
        cursor = conn.cursor(dictionary=True)
        query = "SELECT id, nombre, path_audio, img_banner, tipo FROM categorias"
        cursor.execute(query)
        categorias = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(categorias)
    else:
        return jsonify({"error": "No se pudo conectar a la base de datos"}), 500

@app.route('/api/categorias/nueva', methods=['POST'])
def nueva_categoria():
    if request.method == 'OPTIONS':
        return '', 204
        
    conn = None
    cursor = None
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        # 1. Datos del nuevo Catálogo/Anime
        nombre = request.form.get("nombre") # Ej: "One Piece"
        tipo = request.form.get("tipo")     # Ej: "anime"
        
        # 2. Archivos para el Banner
        file_imagen = request.files.get("imagen") 
        file_audio = request.files.get("audio")

        # Procesar archivos con nombres por defecto si no vienen
        img_banner = "default_banner.png"
        if file_imagen:
            img_banner = secure_filename(file_imagen.filename)
            file_imagen.save(os.path.join(UPLOAD_FOLDER_IMG_BANNER, img_banner))

        path_audio = "default_opening.mp3"
        if file_audio:
            path_audio = secure_filename(file_audio.filename)
            file_audio.save(os.path.join(UPLOAD_FOLDER_AUDIO_BANNER, path_audio))

        # 3. VERIFICACIÓN: Evitar duplicar el banner
        query_buscar = "SELECT id, nombre, CONCAT('banners/', path_audio) AS path_audio, img_banner, tipo FROM categorias WHERE nombre = %s"
        cursor.execute(query_buscar, (nombre,))
        resultado = cursor.fetchone()

        if resultado:
            # Si el anime ya existe, no hacemos nada para no romper el catálogo actual
            return jsonify({"message": f"El catálogo de {nombre} ya existe."}), 400
        
        # 4. INSERTAR EL NUEVO CATÁLOGO
        # Usamos exactamente las columnas de tu imagen: nombre, tipo, path_audio, img_banner
        query_insertar_cat = """
            INSERT INTO categorias (nombre, tipo, path_audio, img_banner) 
            VALUES (%s, %s, %s, %s)
        """
        cursor.execute(query_insertar_cat, (nombre, tipo, path_audio, img_banner))
        
        conn.commit()
        return jsonify({"message": f"¡Catálogo de {nombre} creado exitosamente!"}), 201

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

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

        # 2. Extraemos archivos 
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
            # Si la categoría no existe, no reutilizamos el audio de figura para el banner.
            # Guardamos un audio de banner por defecto en la categoría y reservamos el audio real para el producto.
            sql_insertar_cat = "INSERT INTO categorias (nombre, tipo, path_audio) VALUES (%s, %s, %s)"
            cursor.execute(sql_insertar_cat, (nombre_cat, tipo_cat, 'default_opening.mp3'))
            id_categoria = cursor.lastrowid
        else:
            id_categoria = resultado['id']

        # 4. INSERT Corregido para productos: ahora guardamos path_audio_producto.
        sql_insertar_producto = """
            INSERT INTO productos (nombre, descripcion, precio, stock, fk_categoria_id, img, path_audio_producto) 
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(sql_insertar_producto, (nombre, descripcion, precio, stock, id_categoria, nombre_imagen, nombre_audio))
        
        conn.commit()
        return jsonify({"message": "Reliquia forjada exitosamente", "img": nombre_imagen}), 201

    except Exception as e:
        if conn: conn.rollback()
        print(f"Error en la Bóveda: {e}") # Esto te dirá el error exacto en la consola
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()


@app.route('/api/eliminarproducto/<int:id_producto>', methods=['DELETE'])
def eliminar_producto(id_producto):
    conn = None
    cursor = None
    try:
        conn = get_connection()
        cursor = conn.cursor()
        
        # Vamos directo al grano: borrar
        sql_eliminar = "DELETE FROM productos WHERE id = %s"
        cursor.execute(sql_eliminar, (id_producto,))
        conn.commit() # ¡VITAL para que MySQL guarde el cambio!
        
        if cursor.rowcount == 0:
            return jsonify({"error": "Producto no encontrado"}), 404
        
        return jsonify({"message": "Producto eliminado exitosamente"}), 200

    except Exception as e:
        if conn: conn.rollback()
        return jsonify({"error": "Error interno"}), 500
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