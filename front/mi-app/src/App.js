import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import Login from './components/login';
import Registro from './components/registros';
import Dashboard from './components/dashboard';
import CargaProd from './components/cargaprod';
import Tarjetas from './components/tarjeta';
import Eliminarprod from './components/eliminarprod';
import Catalogo from './components/catalogo';
import DelegarRoll from './components/delegar_roll';

function App() {
  const [vista, setVista] = useState('login');
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);
  const [idSeleccionado, setIdSeleccionado] = useState(null);

  // 1. Manejo de Login
  const manejarLoginExitoso = (datosDelUsuario) => {
    setUsuarioLogueado(datosDelUsuario);
    setVista('dashboard');
  };

  // 2. Función Unificada para Ver Detalles
  // Centralizar esto asegura que siempre se ejecute en el orden correcto
  const verDetalleFigura = (id) => {
    if (id) {
      setIdSeleccionado(id); 
      setVista('tarjeta'); // Usamos siempre minúsculas para evitar conflictos
    } else {
      console.error("Error de Sistema: Se intentó navegar a detalles sin un ID.");
    }
  };

  return (
    <div className="container mt-5">
      
      {/* --- PANTALLA: LOGIN --- */}
      {vista === 'login' && (
        <Login 
          irARegistro={() => setVista('registro')} 
          alLoguearse={manejarLoginExitoso} 
        />
      )}

      {/* --- PANTALLA: REGISTRO --- */}
      {vista === 'registro' && (
        <Registro irALogin={() => setVista('login')} />
      )}

      {/* --- PANTALLA: DASHBOARD --- */}
      {vista === 'dashboard' && (
        <Dashboard 
          user={usuarioLogueado} 
          irALogin={() => setVista('login')}
          irACargaProd={() => setVista('cargaprod')}
          irAEliminarprod={() => setVista('eliminarprod')}
          irACatalogo={() => setVista('catalogo')}
          irADelegarRoll={() => setVista('delegarroll')}
          // Pasamos la función centralizada
          irATarjetas={verDetalleFigura} 
        />
      )}

      {/* --- PANTALLA: CARGA DE PRODUCTOS --- */}
      {vista === 'catalogo' && (
        <Catalogo 
          user={usuarioLogueado}
          irADashboard={() => setVista('dashboard')} 
        />
      )}
      {vista === 'cargaprod' && (
        <CargaProd 
          irAlDashboard={() => setVista('dashboard')} 
        />
      )}
      {vista === 'eliminarprod' && (
        <Eliminarprod 
          irAlDashboard={() => setVista('dashboard')} 
        />
      )}

      {/* --- PANTALLA: DETALLE (TARJETAS) --- */}
      {vista === 'tarjeta' && (
        <Tarjetas 
          id={idSeleccionado}
          irAlDashboard={() => setVista('dashboard')}
        />
      )}
      
      {vista === 'delegarroll' && (
        <DelegarRoll 
          irAlDashboard={() => setVista('dashboard')} 
        />
      )}
    </div>
  );
}

export default App;