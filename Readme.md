PROYECTO: LA BÓVEDA LEGENDARIA - Catálogo de Figuras
---------------------------------------------------

Este proyecto es un sistema Full Stack (React + Flask + MySQL).

ESTRUCTURA DE CARPETAS:
/frontend  -> Código de la interfaz en React.
/backend   -> Servidor API en Python/Flask.
/database  -> Archivo SQL para la base de datos.

PASOS PARA LA EJECUCIÓN:

1. BASE DE DATOS:
   - Importar el archivo 'db_boveda_legendaria.sql' en MySQL Workbench.
   - El script creará la base de datos 'tienda_anime' y las tablas con datos.

2. BACKEND:
   - Navegar a la carpeta /backend.
   - Instalar dependencias: pip install -r requirements.txt
   - Configurar credenciales: En database.py, verificar usuario/password de MySQL.
   - Ejecutar: python app.py (El servidor corre en http://127.0.0.1:5000)

3. FRONTEND:
   - Navegar a la carpeta /frontend.
   - Instalar dependencias: npm install
   - Ejecutar: npm start
   - La aplicación se abrirá en http://localhost:3000

NOTAS: Las imágenes y audios de los productos se encuentran en /backend/static/assets/img/