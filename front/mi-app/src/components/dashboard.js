import React, { useState, useEffect, useRef } from 'react';
import '../App.css';

const Dashboard = ({ user, irALogin, irACargaProd, irATarjetas, irAEliminarprod }) => {
  const [productos, setProductos] = useState([]);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  // 1. El cajón (Referencia)
  const audioref = useRef(null);

  // 2. Función para sonar
  function reproducirAudio(archivo) {
    let ruta = 'http://127.0.0.1:5000/static/assets/audio/' + archivo;

    if (!audioref.current) {
      audioref.current = new Audio(ruta);
    } else {
      audioref.current.pause();
      audioref.current.src = ruta;
      audioref.current.load();
    }

    audioref.current.play().catch(() => console.log("Interacción requerida"));
  }

  // 3. Función para callar
  function detenerAudio() {
    if (audioref.current) {
      audioref.current.pause();
      audioref.current.currentTime = 0;
    }
  }

  // --- LÓGICA DE LIMPIEZA Y CARGA ---
  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/inicio')
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(err => console.error("Error:", err));

    return () => {
      if (audioref.current) {
        audioref.current.pause();
        audioref.current.currentTime = 0;
      }
    };
  }, []);

  return (
    <div className="dashboard-container">
      {/* BOTÓN MENU */}
      <button className="btn-toggle" onClick={() => setMenuAbierto(!menuAbierto)}>
        {menuAbierto ? '✕' : '☰ MENU'}
      </button>

      {/* SIDEBAR */}
      <aside className={`sidebar-boveda ${menuAbierto ? 'open' : ''}`}>
        <h2 className="boveda-titulo mt-5 mb-4">VAULT</h2>
        <hr className="bg-danger" />
        <div className="list-group list-group-flush">
          <button className="btn btn-link text-white text-decoration-none py-3 text-start">🏯 Catálogo</button>
          <button className="btn btn-link text-white text-decoration-none py-3 text-start">👤 Mi Perfil</button>
          {(user?.rol === 'admin' || user?.rol === 'ayudante') && (
            <button className="btn btn-link text-warning text-decoration-none py-3 text-start fw-bold" onClick={irACargaProd}>🛡️ Cargar Productos</button>
          )}
          {(user?.rol === 'admin') && (
            <button className="btn btn-link text-white text-decoration-none py-3 text-start" onClick={irAEliminarprod}>🗑️ Eliminar Producto</button>
          )}
          <button className="btn btn-link text-white text-decoration-none py-3 text-start" onClick={irALogin}>🚪 Cerrar Sesión</button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <div className={`main-content p-5 ${menuAbierto ? 'blur-active' : ''}`}>
        <header className="boveda-banner d-flex justify-content-between align-items-center mb-5 mt-4">
          <h1 className="boveda-titulo m-0">Explorar Bóveda</h1>
          <div className="text-end">
             <span className="badge border border-danger p-2">
                {user?.nombre} | {user?.rol || 'Sin Rol'}
             </span>
          </div>
        </header>

        <div className="row">
          {productos.map((p, index) => (
            <div 
              key={index} 
              className="col-md-4 mb-4" 
              onMouseEnter={() => reproducirAudio(p.path_audio)} 
              onMouseLeave={detenerAudio}
            >
              {/* TARJETA UNIFICADA */}
              <div className="boveda-banner h-100 d-flex flex-column p-0 overflow-hidden"> 
                
                {/* CONTENEDOR DE IMAGEN */}
                <div style={{ 
                  height: "250px", 
                  width: "100%", 
                  overflow: "hidden", 
                  backgroundColor: "#000",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}>
                  <img 
                    src={`http://127.0.0.1:5000/static/assets/img/${p.img}`}
                    alt={p.nombre}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => { e.target.src = "https://via.placeholder.com/250?text=No+Image"; }}
                  />
                </div>

                {/* CONTENEDOR DE TEXTO Y BOTÓN */}
                <div className="p-3 d-flex flex-column flex-grow-1">
                  <h3 className="boveda-titulo h5 mb-1">{p.nombre}</h3>
                  <p className="text-muted small mb-3">Categoría: {p.nombre_categorias}</p>
                  
                  <div className="mt-auto">
                    <p className="fs-4 fw-bold text-white mb-3">${p.precio}</p>
                    <button 
                      className="btn-boveda w-100" 
                      onClick={() => {
                        detenerAudio();
                        setProductoSeleccionado(p); 
                        irATarjetas(p.id);
                      }}
                    >
                      VER DETALLE
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

      {menuAbierto && (
        <div 
          style={{ position: 'fixed', inset: 0, zIndex: 999 }} 
          onClick={() => setMenuAbierto(false)} 
        />
      )}
    </div>
  );
};

export default Dashboard;