import React, { useState, useEffect, useRef } from 'react';
import '../App.css';
import FormularioCategoria from './catalogform'; 

const Catalogo = ({ irADashboard, irATarjetas, user }) => {
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false); 
  const [figuras, setFiguras] = useState([]);
  const [cargando, setCargando] = useState(false);
  
  const audioRef = useRef(null);

  // --- 1. CONTROL DE AUDIO (Lógica Maestra) ---
  const detenerAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = ""; 
      // Forzamos la limpieza del objeto para que no queden hilos de audio
      audioRef.current = null;
    }
  };

  const reproducirOpening = (archivo) => {
    if (!archivo) return;
    const ruta = `http://127.0.0.1:5000/static/assets/audio/${archivo}`;
    
    detenerAudio(); 

    audioRef.current = new Audio(ruta);
    audioRef.current.play().catch(() => console.log("Interacción requerida")); 
  };

  // --- 2. BACKEND ---
  const cargarbanners = () => {
    fetch('http://127.0.0.1:5000/api/categorias')
      .then(res => res.json())
      .then(data => setCategorias(data))
      .catch(err => console.error(err));
  };

  const cargarFiguras = async (id) => {
    try {
      setCargando(true);
      const respuesta = await fetch(`http://127.0.0.1:5000/api/tarjetas_de_categoria/${id}`);
      if (respuesta.ok) {
        const datos = await respuesta.json();
        setFiguras(Array.isArray(datos) ? datos : []);
      }
    } finally { setCargando(false); }
  };

  // --- 3. CICLO DE VIDA ---
  useEffect(() => {
    cargarbanners();
    return () => detenerAudio(); // Cleanup al cerrar componente
  }, []);

  return (
    <div className="dashboard-container catalogo-container">
      <h1 className="boveda-header-title text-warning text-center my-4">LA BÓVEDA LEGENDARIA</h1>

      <button className="btn-boveda-back mb-4" onClick={() => { detenerAudio(); irADashboard(); }}>
        ← VOLVER AL DASHBOARD
      </button>

      {!categoriaSeleccionada ? (
        /* VISTA A: SELECCIÓN DE MUNDOS */
        <div className="row justify-content-center animate__animated animate__fadeIn">
          {categorias.map((cat) => (
            <div key={cat.id} className="col-12 col-md-6 col-lg-4 mb-5">
              <div 
                className="boveda-world-card" 
                onClick={() => {
                  detenerAudio(); // MATAMOS el audio del banner antes de entrar
                  setCategoriaSeleccionada(cat);
                  cargarFiguras(cat.id);
                }}
                onMouseEnter={() => reproducirOpening(cat.path_audio)} 
                onMouseLeave={detenerAudio}
                style={{ cursor: 'pointer' }}
              >
                <div className="boveda-neon-frame">
                  <img src={`http://127.0.0.1:5000/static/assets/img/banners/${cat.img_banner}`} alt={cat.nombre} className="boveda-img" />
                  <div className="boveda-info-overlay text-center">
                    <h2 className="boveda-name">{cat.nombre}</h2>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* VISTA B: LISTADO DE FIGURAS */
        <div className="animate__animated animate__fadeIn">
          <div className="d-flex justify-content-between align-items-center border-bottom border-warning mb-4 pb-2">
            <h2 className="text-white">MUNDO: <span className="text-warning">{categoriaSeleccionada.nombre}</span></h2>
            <button className="btn btn-warning btn-sm fw-bold" onClick={() => { 
                detenerAudio(); 
                setCategoriaSeleccionada(null); 
                setFiguras([]); 
            }}>
              ← CAMBIAR MUNDO
            </button>
          </div>
          
          <div className="row">
            {cargando ? (
              <p className="text-warning text-center w-100">INVOCANDO FIGURAS...</p>
            ) : figuras.map((fig) => (
              <div key={fig.id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 d-flex">
                <div 
                  className="figura-display-card d-flex flex-column w-100"
                  onMouseEnter={() => reproducirOpening(categoriaSeleccionada.path_audio)} // REPRODUCE al posar el mouse
                  onMouseLeave={detenerAudio} // DETIENE al sacar el mouse
                >
                   <div className="boveda-neon-frame d-flex flex-column h-100">
                      <img 
                        src={`http://127.0.0.1:5000/static/assets/img/${fig.img}`} 
                        className="boveda-img" 
                        alt={fig.nombre} 
                      />
                      
                      <div className="p-3 d-flex flex-column flex-grow-1 bg-dark">
                        <h3 className="text-white h5 mb-1 fw-bold text-uppercase">{fig.nombre}</h3>
                        <p className="text-muted small mb-3">Categoría: {categoriaSeleccionada.nombre}</p>
                        
                        <div className="mt-auto">
                          <p className="fs-3 fw-bold text-white mb-3">${fig.precio}</p>
                          <button 
                            className="btn-boveda w-100" 
                            onClick={() => {
                                detenerAudio(); // Solo se detiene definitivamente aquí
                                if (irATarjetas) irATarjetas(fig.id);
                            }}
                          >
                            VER DETALLE
                          </button>
                        </div>
                      </div>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Catalogo;