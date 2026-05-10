import React, { useState, useEffect, useRef } from 'react';
import '../App.css';
import FormularioCategoria from './catalogform'; // Importante: Verifica la ruta

const Catalogo = ({ irADashboard, irATarjetas, user }) => {
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [figuras, setFiguras] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  
  const audioRef = useRef(null);

  // --- 1. CONTROL DE AUDIO ---
  const detenerAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = ""; 
    }
  };

  const buildAudioUrl = (archivo, esBanner = false) => {
    if (!archivo) return null;
    const nombre = archivo.toString().trim();
    if (!nombre || nombre === "null") return null;

    const fileName = nombre.toLowerCase().endsWith('.mp3') ? nombre : `${nombre}.mp3`;
    const prefix = esBanner ? 'banners/' : '';
    
    return `http://127.0.0.1:5000/static/assets/audio/${prefix}${fileName}`;
  };

  const reproducirOpening = async (rutaParcial, esBanner = false) => {
    const urlFinal = buildAudioUrl(rutaParcial, esBanner);
    if (!urlFinal) return;

    detenerAudio();
    console.log("Invocando audio en Catálogo:", urlFinal);

    const nuevoAudio = new Audio(urlFinal);
    audioRef.current = nuevoAudio;

    try {
      await nuevoAudio.play();
    } catch (err) {
      if (!esBanner) {
        const fallbackUrl = buildAudioUrl(rutaParcial, true);
        console.log("Intentando fallback en banners:", fallbackUrl);
        const audioFallback = new Audio(fallbackUrl);
        audioRef.current = audioFallback;
        audioFallback.play().catch(() => console.log("Audio no encontrado."));
      }
    }
  };

  // --- 2. BACKEND ---
  const cargarbanners = () => {
    fetch('http://127.0.0.1:5000/api/categorias')
      .then(res => res.json())
      .then(data => setCategorias(data))
      .catch(err => console.error("Error al cargar categorías:", err));
  };

  const cargarFiguras = async (id) => {
    try {
      setCargando(true);
      const respuesta = await fetch(`http://127.0.0.1:5000/api/tarjetas_de_categoria/${id}`);
      if (respuesta.ok) {
        const datos = await respuesta.json();
        setFiguras(Array.isArray(datos) ? datos : []);
      }
    } catch (err) {
      console.error("Error al cargar figuras:", err);
    } finally { 
      setCargando(false); 
    }
  };

  useEffect(() => {
    cargarbanners();
    return () => detenerAudio();
  }, []);

  return (
    <div className="dashboard-container catalogo-container">
      <h1 className="boveda-header-title text-warning text-center my-4">LA BÓVEDA LEGENDARIA</h1>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <button className="btn-boveda-back" onClick={() => { detenerAudio(); irADashboard(); }}>
          ← VOLVER AL DASHBOARD
        </button>

        {/* BOTÓN DE CARGA: Solo visible para Admin y en la vista de Mundos */}
        {user?.rol === 'admin' && !categoriaSeleccionada && (
          <button 
            className={`btn ${mostrarFormulario ? 'btn-outline-light' : 'btn-danger'} fw-bold shadow`}
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
          >
            {mostrarFormulario ? '✖ CANCELAR' : '＋ NUEVO MUNDO'}
          </button>
        )}
      </div>

      {/* FORMULARIO DE CATEGORÍA */}
      {mostrarFormulario && user?.rol === 'admin' && !categoriaSeleccionada && (
        <div className="animate__animated animate__fadeInDown mb-5">
          <FormularioCategoria onCategoriaCreada={() => {
            cargarbanners();
            setMostrarFormulario(false);
          }} />
        </div>
      )}

      {!categoriaSeleccionada ? (
        /* VISTA A: SELECCIÓN DE MUNDOS */
        <div className={`row justify-content-center animate__animated ${mostrarFormulario ? 'opacity-25' : 'animate__fadeIn'}`}>
          {categorias.map((cat) => (
            <div key={cat.id} className="col-12 col-md-6 col-lg-4 mb-5">
              <div 
                className="boveda-world-card" 
                onClick={() => {
                  detenerAudio(); 
                  setCategoriaSeleccionada(cat);
                  cargarFiguras(cat.id);
                }}
                onMouseEnter={() => reproducirOpening(cat.path_audio, true)} 
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
            <h2 className="text-white">MUNDO: <span className="text-warning text-uppercase">{categoriaSeleccionada.nombre}</span></h2>
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
              <p className="text-warning text-center w-100 fs-4">INVOCANDO FIGURAS...</p>
            ) : figuras.length > 0 ? (
              figuras.map((fig) => (
                <div key={fig.id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 d-flex">
                  <div 
                    className="figura-display-card d-flex flex-column w-100"
                    onMouseEnter={() => reproducirOpening(fig.path_audio_producto)}
                    onMouseLeave={detenerAudio} 
                  >
                     <div className="boveda-neon-frame d-flex flex-column h-100">
                        <img 
                          src={`http://127.0.0.1:5000/static/assets/img/${fig.img}`} 
                          className="boveda-img" 
                          alt={fig.nombre} 
                        />
                        <div className="p-3 d-flex flex-column flex-grow-1 bg-dark">
                          <h3 className="text-white h5 mb-1 fw-bold text-uppercase">{fig.nombre}</h3>
                          <p className="text-muted small mb-3">Colección: {categoriaSeleccionada.nombre}</p>
                          <div className="mt-auto">
                            <p className="fs-3 fw-bold text-white mb-3">${fig.precio}</p>
                            <button 
                              className="btn-boveda w-100" 
                              onClick={() => {
                                  detenerAudio(); 
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
              ))
            ) : (
              <p className="text-white text-center w-100">No hay figuras en esta sección de la bóveda.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Catalogo;