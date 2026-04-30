import React, { useState } from 'react';
import '../App.css'; // Asegúrate de que los estilos del banner estén aquí

const Login = ({ irARegistro, alLoguearse }) => {
  const [mail, setMail] = useState('');
  const [contrasena, setContrasena] = useState('');

  const manejarEnvio = async (e) => {
    e.preventDefault();

    if (!mail || !contrasena) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    try {
      const respuesta = await fetch('http://127.0.0.1:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mail, contrasena })
      });

      const datos = await respuesta.json();

      if (respuesta.ok) {
        // Usamos la prop que viene de App.js para loguear
        alLoguearse(datos.user); 
      } else {
        alert(datos.error || "Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error en el servidor:", error);
      alert("No se pudo conectar con la bóveda (servidor apagado)");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      {/* Aplicamos la clase boveda-banner para mantener el estilo visual */}
      <div className="boveda-banner" style={{ maxWidth: '400px', width: '100%' }}>
        
        <div className="text-center mb-4">
          <h2 className="boveda-titulo">⛩️ INICIAR SESIÓN</h2>
          <p className="text-white small">Ingresá a la Bóveda Legendaria</p>
        </div>

        <form onSubmit={manejarEnvio}>
          <div className="mb-3">
            <label className="form-label boveda-titulo" style={{ fontSize: '0.8rem' }}>Usuario o Email</label>
            <input 
              type="email" 
              className="form-control bg-dark text-white border-secondary"
              placeholder="nombre@ejemplo.com"
              value={mail} 
              onChange={(e) => setMail(e.target.value)} 
            />
          </div>

          <div className="mb-4">
            <label className="form-label boveda-titulo" style={{ fontSize: '0.8rem' }}>Contraseña</label>
            <input 
              type="password" 
              className="form-control bg-dark text-white border-secondary"
              placeholder="••••••••"
              value={contrasena} 
              onChange={(e) => setContrasena(e.target.value)} 
            />
          </div>

          <button type="submit" className="btn-boveda mb-3">
            ENTRAR A LA BÓVEDA
          </button>

          <div className="text-center">
            <span 
              className="text-muted small" 
              style={{ cursor: 'pointer', textDecoration: 'underline' }}
              onClick={irARegistro}
            >
              ¿No tienes cuenta? Registrate aquí
            </span>
          </div>
        </form>

      </div>
    </div>
  );
};

export default Login;