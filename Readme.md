🏯 La Bóveda Legendaria - Anime Figure Catalog
Sistema de gestión y catálogo de figuras de anime desarrollado con el stack React (Frontend) y Flask (Backend), utilizando MySQL para la persistencia de datos.

🛠️ 1. Requisitos Previos (Links de Descarga)
Es obligatorio instalar las siguientes herramientas oficiales antes de configurar el código:

Python (v3.10+): Descargar aquí

Node.js (LTS): Descargar aquí

MySQL Community Installer: Descargar aquí

IMPORTANTE: Al instalar MySQL, elige la opción "Developer Default".

AVISO: Este proyecto NO es compatible con Microsoft SQL Server. Solo funciona con MySQL 8.0 o superior.

🗄️ 2. Configuración de la Base de Datos (MySQL)
Estado del Servicio: Abre "Servicios" en Windows y verifica que MySQL80 esté "En ejecución".

Importar el Script:

Abre MySQL Workbench y entra en tu instancia local (puerto 3306).

Ve a Administration > Data Import/Restore.

Selecciona Import from Self-Contained File y busca el archivo .sql del proyecto.

Crea un nuevo esquema (Database) llamado la_boveda y haz clic en Start Import.

🐍 3. Configuración del Backend (Flask)
Desde una terminal en la carpeta /backend, ejecuta estos comandos en orden:

A. Entorno Virtual (venv)
Bash
# 1. Crear el entorno virtual
python -m venv venv

# 2. Activar el entorno (En Windows)
.\venv\Scripts\activate
B. Instalación de Librerías (Consola)
Una vez activado el (venv), instala las dependencias que el código necesita para los import:

Bash
# Framework y CORS
pip install Flask flask-cors

# Conector de Base de Datos
pip install mysql-connector-python
⚛️ 4. Configuración del Frontend (React)
Desde una terminal en la carpeta /frontend, ejecuta:

Instalar módulos base:

Bash
npm install
Instalar librerías de funciones:

Bash
npm install axios react-router-dom
🚀 5. Ejecución del Proyecto
Debes abrir dos terminales diferentes:

Terminal 1 (Backend): Con el venv activo, ejecuta python app.py.

Terminal 2 (Frontend): Ejecuta npm start.

Accede a la app en: http://localhost:3000.

⚠️ Solución de Problemas (Triage)
Error "Unable to connect to 127.0.0.1:3306": Tienes instalado el Workbench pero no el MySQL Server. Reabre el instalador y añade el componente "Server".

Error de Sintaxis SQL: No uses SQL Server Management Studio. El script solo es válido para MySQL.

Error de Librería No Encontrada: Verifica que activaste el entorno virtual antes de ejecutar el servidor de Flask.