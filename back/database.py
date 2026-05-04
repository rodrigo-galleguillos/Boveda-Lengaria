import mysql.connector

def get_connection():
    try:
        connection = mysql.connector.connect(
            host='localhost',
            user='root',      # Generalmente es 'root'
            password='admin9431',
            database='tienda_anime'
        )
        if connection.is_connected():
            print("¡Éxito! Conectado a la base de datos tienda_anime")
            return connection

    except mysql.connector.Error as err:
        print(f"Error al conectar: {err}")
        return None

# Esta parte es solo para probar que funcione ahora mismo
if __name__ == "__main__":
    get_connection()