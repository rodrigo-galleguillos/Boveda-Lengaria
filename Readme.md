🏛️ La Bóveda Legendaria
Sistema de Gestión de Figuras Coleccionables (Full Stack)
Este proyecto es una plataforma integral diseñada para coleccionistas de figuras de anime. Permite gestionar un catálogo completo con funcionalidades de Login, Registro y un Dashboard interactivo con personajes estilo pixel art.

📂 Estructura del Proyecto
El repositorio está organizado de manera que la lógica de servidor, la interfaz de usuario y los datos estén desacoplados:

/fron: Contiene toda la interfaz de usuario desarrollada en React.js.

/back: Servidor API y lógica de negocio programada en Python con Flask.

/database.py: Scripts SQL para la creación y población de la base de datos.

🛠️ Guía de Instalación y Ejecución
Para poner en marcha el proyecto localmente, seguí estos tres pasos:

1. Base de Datos 🗄️
Abrí tu gestor de base de datos (como MySQL Workbench) e importá el archivo db_boveda_legendaria.sql ubicado en la carpeta /db. Este script se encargará de crear la base de datos tienda_anime junto con las tablas y los datos de prueba necesarios para que el catálogo no esté vacío al iniciar.

2. Backend (Servidor API) 🐍
Navegá a la carpeta del servidor mediante la terminal. Es recomendable crear un entorno virtual para mantener limpias las dependencias.

Bash
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
Nota importante: Antes de ejecutar el servidor, revisá el archivo database.py para verificar que las credenciales de acceso (usuario y contraseña) coincidan con las de tu instancia local de MySQL. Finalmente, iniciá el servicio con: python app.py. El servidor quedará escuchando en [http://127.0.0.1:5000](http://127.0.0.1:5000).

3. Frontend (Interfaz Web) ⚛️
En una nueva terminal, dirigite a la carpeta de la interfaz y realizá la instalación de los módulos de Node:

Bash
cd frontend
npm install
npm start
La aplicación se abrirá automáticamente en tu navegador en la dirección http://localhost:3000.

✨ Características Principales
Gestión de Inventario: Visualización dinámica de figuras de anime consumiendo una API propia.

Seguridad: Sistema robusto de autenticación y registro de usuarios.

Estética Retro: Sistema de animaciones interactivas utilizando CSS Spritesheets y personajes tipo pixel art.

Arquitectura Limpia: Separación estricta de responsabilidades entre el frontend y el backend.

✒️ Autor
Rodrigo Galleguillos - Backend Developer - GitHub Profile