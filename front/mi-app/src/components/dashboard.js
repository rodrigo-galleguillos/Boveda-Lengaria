import React, { useState, useEffect, useRef } from 'react';
import '../App.css';

const Dashboard = ({ user, irALogin, irACargaProd, irATarjetas, irAEliminarprod, irACatalogo, irADelegarRoll }) => {
  const [productos, setProductos] = useState([]);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const audioref = useRef(null);

  // --- LÓGICA DE AUDIO SIMPLIFICADA ---
  const reproducirAudio = (nombreArchivo) => {
    if (!nombreArchivo) return;

    // Aseguramos la extensión .mp3
    const archivoFinal = nombreArchivo.toLowerCase().endsWith('.mp3') 
      ? nombreArchivo 
      : `${nombreArchivo}.mp3`;

    // Las figuras están en la raíz de /audio/
    const urlFinal = `http://127.0.0.1:5000/static/assets/audio/${archivoFinal}`;
    
    console.log("Intentando sonar figura:", urlFinal);

    if (!audioref.current) {
      audioref.current = new Audio(urlFinal);
    } else {
      audioref.current.pause();
      audioref.current.src = urlFinal;
      audioref.current.load();
    }

    audioref.current.play().catch(err => {
      console.warn("Reproducción bloqueada o archivo no encontrado en:", urlFinal);
    });
  };

  const detenerAudio = () => {
    if (audioref.current) {
      audioref.current.pause();
      audioref.current.currentTime = 0;
      audioref.current.src = "";
    }
  };

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/inicio')
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(err => console.error("Error al cargar novedades:", err));

    return () => detenerAudio();
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
          <button className="btn btn-link text-white text-decoration-none py-3 text-start" onClick={irACatalogo}>🏯 Catálogo</button>
          <button className="btn btn-link text-white text-decoration-none py-3 text-start">👤 Mi Perfil</button>
          {(user?.rol === 'admin' || user?.rol === 'ayudante') && (
            <button className="btn btn-link text-warning text-decoration-none py-3 text-start fw-bold" onClick={irACargaProd}>🛡️ Cargar Productos</button>
          )}
          {(user?.rol === 'admin') && (
            <button className="btn btn-link text-white text-decoration-none py-3 text-start" onClick={irAEliminarprod}>🗑️ Eliminar Producto</button>
          )}
          {(user?.rol === 'admin') && (
            <button className="btn btn-link text-white text-decoration-none py-3 text-start" onClick={irADelegarRoll}>⚔️ Delegar Roles</button>
          )}
          <button className="btn btn-link text-white text-decoration-none py-3 text-start" onClick={() => { detenerAudio(); irALogin(); }}>🚪 Cerrar Sesión</button>
        </div>
      </aside>

      <div className={`main-content p-5 ${menuAbierto ? 'blur-active' : ''}`}>
        <header className="boveda-banner d-flex justify-content-between align-items-center mb-5 mt-4">
          <h1 className="boveda-titulo m-0">EXPLORAR BÓVEDA</h1>
          <div className="text-end">
             <span className="badge border border-danger p-2">
                {user?.nombre} | {user?.rol || 'user'}
             </span>
          </div>
        </header>

        <h2 className="text-danger fw-bold mb-4" style={{ letterSpacing: '2px' }}>ÚLTIMAS AGREGADAS</h2>

        <section>
          <div className="row">
            {productos.length > 0 ? (
              productos.map((p) => (
                <div 
                  key={p.id} 
                  className="col-md-4 mb-4" 
                  onMouseEnter={() => reproducirAudio(p.path_audio_producto)} 
                  onMouseLeave={detenerAudio}
                >
                  <div className="boveda-banner h-100 d-flex flex-column p-0 overflow-hidden shadow-lg" style={{ borderRadius: '15px', border: '1px solid #ff4d4d' }}> 
                    <div style={{ height: "280px", overflow: "hidden", backgroundColor: "#000" }}>
                      <img 
                        src={`http://127.0.0.1:5000/static/assets/img/${p.img}`}
                        alt={p.nombre}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                    <div className="p-3 d-flex flex-column flex-grow-1 bg-dark">
                      <h3 className="text-white h5 mb-1 fw-bold text-uppercase">{p.nombre}</h3>
                      <p className="text-muted small mb-3">Mundo: {p.nombre_categorias}</p>
                      <div className="mt-auto">
                        <p className="fs-3 fw-bold text-white mb-3">${p.precio}</p>
                        <button 
                          className="btn-boveda w-100" 
                          onClick={() => { detenerAudio(); irATarjetas(p.id); }}
                        >
                          VER DETALLE
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-white text-center">Buscando reliquias...</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;