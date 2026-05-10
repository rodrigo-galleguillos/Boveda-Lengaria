🏯 La Bóveda Legendaria - Anime Figure Catalog
Sistema de gestión y catálogo de figuras de anime desarrollado con el stack React (Frontend) y Flask (Backend), utilizando MySQL para la persistencia de datos.

🛠️ 1. Requisitos Previos (Links de Descarga)
Es obligatorio instalar las siguientes herramientas oficiales antes de configurar el código:

Python (v3.10+): https://www.python.org/downloads/

Node.js (LTS): https://nodejs.org/

MySQL Community Installer: https://dev.mysql.com/downloads/installer/

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
Desde una terminal en la carpeta /back, ejecuta estos comandos en orden:

A. Entorno Virtual (venv)
Crear el entorno: python -m venv venv

Activar en Windows: .\venv\Scripts\activate

B. Instalación de Librerías (Consola)
Una vez activado el (venv), instala las dependencias necesarias:

pip install Flask flask-cors

pip install mysql-connector-python

⚛️ 4. Configuración del Frontend (React)
Desde una terminal en la carpeta /front, ejecuta:

Instalar módulos base: npm install

Instalar librerías de funciones: npm install axios react-router-dom

🚀 5. Ejecución del Proyecto
Debes abrir dos terminales diferentes:

Terminal 1 (Backend): Con el venv activo, ejecutá python app.py.

Terminal 2 (Frontend): Ejecutá npm start.

Accede a la app en: http://localhost:3000

⚠️ Solución de Problemas (Triage)
Error "Unable to connect to 127.0.0.1:3306": Tienes instalado el Workbench pero no el MySQL Server. Reabre el instalador y añade el componente "Server".

Error de Sintaxis SQL: No uses SQL Server Management Studio. El script solo es válido para MySQL.

Error de Librería No Encontrada: Verifica que activaste el entorno virtual antes de ejecutar el servidor de Flask.