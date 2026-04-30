import React, { useState } from 'react';

const Registro = ({ irALogin }) => {
    // 1. ESTADOS (La memoria del componente)
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [dni, setDni] = useState('');
    const [mail, setMail] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [confirmacion, setConfirmacion] = useState('');
    const [telefono, setTelefono] = useState('');
    const [pais, setPais] = useState('Argentina'); // Valor inicial por defecto
    const [provincia, setProvincia] = useState('');
    const [ciudad, setCiudad] = useState('');
    const [usuario, setUsuario] = useState('');

    // 2. FUNCIÓN DE FILTRO PARA CIUDAD (Solo letras)
    // Debe estar fuera de manejarRegistro para que funcione mientras escribís
    const manejarCambioCiudad = (e) => {
        const texto = e.target.value;
        if (/^[a-zA-Z\sñÑáéíóúÁÉÍÓÚ]*$/.test(texto)) {
            setCiudad(texto);
        }
    };

    const manejarCambioDni = (e) => {
    const texto = e.target.value;
    if (/^\d{0,8}$/.test(texto)) {
        setDni(texto);
    }
};

    // 3. FUNCIÓN DE ENVÍO (Al apretar el botón)
    const manejarRegistro = async (e) => {
        e.preventDefault();

        // Validación de seguridad local
        if (contrasena !== confirmacion) {
            alert("Las contraseñas no coinciden. Por favor, verificalas.");
            return; 
        }

        const nuevoUsuario = {
            nombre, apellido, dni, mail, contrasena, confirmacion,
            telefono, pais, provincia, ciudad, usuario
        };

        try {
            const respuesta = await fetch('http://127.0.0.1:5000/api/registro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuevoUsuario)
            });

            if (respuesta.ok) {
                const data = await respuesta.json();
                alert("¡Éxito! Flask dice: " + data.mensaje);
                irALogin(); 
            } else {
                alert("Error en el servidor. Código: " + respuesta.status);
            }
        } catch (error) {
            console.error("Error de conexión:", error);
            alert("No se pudo conectar con el servidor Flask.");
        }
    };

    // 4. EL DIBUJO (HTML/JSX)
    return (
        <div className="card shadow p-4 mx-auto" style={{ maxWidth: '800px' }}>
            <h2 className="text-center mb-4">Nuevo Coleccionista</h2>

            <form onSubmit={manejarRegistro}>

                {/* FILA 1: Identidad */}
                <div className="row mb-3">
                    <div className="col-md-4">
                        <label className="form-label">Nombre</label>
                        <input type="text" className="form-control" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Apellido</label>
                        <input type="text" className="form-control" value={apellido} onChange={(e) => setApellido(e.target.value)} />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">DNI</label>
                        <input type="number" className="form-control" value={dni} onChange={manejarCambioDni} />
                    </div>
                </div>

                {/* FILA 2: Contacto y Usuario */}
                <div className="row mb-3">
                    <div className="col-md-4">
                        <label className="form-label">Nombre de Usuario</label>
                        <input type="text" className="form-control" value={usuario} onChange={(e) => setUsuario(e.target.value)} />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Email</label>
                        <input type="email" className="form-control" value={mail} onChange={(e) => setMail(e.target.value)} />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Teléfono</label>
                        <input type="tel" className="form-control" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
                    </div>
                </div>

                {/* FILA 3: Ubicación */}
                <div className="row mb-3">
                    <div className="col-md-4">
                        <label className="form-label">País</label>
                        <select className="form-select" value={pais} onChange={(e) => setPais(e.target.value)}>
                            <option value="Argentina">Argentina</option>
                            <option value="Uruguay">Uruguay</option>
                            <option value="Chile">Chile</option>
                        </select>
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Provincia</label>
                        <input type="text" className="form-control" value={provincia} onChange={(e) => setProvincia(e.target.value)} />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Ciudad</label>
                        <input type="text" className="form-control" value={ciudad} onChange={manejarCambioCiudad} />
                    </div>
                </div>

                {/* FILA 4: Seguridad */}
                <div className="row mb-4">
                    <div className="col-md-6">
                        <label className="form-label">Contraseña</label>
                        <input type="password" className="form-control" value={contrasena} onChange={(e) => setContrasena(e.target.value)} />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Confirmar Contraseña</label>
                        <input type="password" className="form-control" value={confirmacion} onChange={(e) => setConfirmacion(e.target.value)} />
                    </div>
                </div>

                <button type="submit" className="btn btn-success w-100 py-2">
                    Finalizar Registro
                </button>

                <button type="button" className="btn btn-link w-100 mt-2" onClick={irALogin}>
                    ¿Ya tenés cuenta? Iniciar sesión
                </button>
            </form>
        </div>
    );
};

export default Registro;