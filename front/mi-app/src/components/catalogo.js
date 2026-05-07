import React, { useState, useEffect, useRef } from 'react';
import '../App.css';
import FormularioCategoria from './catalogform'; 

const Catalogo = ({ irADashboard, user }) => {
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false); 
  const rol = user?.rol || 'invitado'; 
  
  const audioRef = useRef(null);

  const cargarbanners = () => {
    fetch('http://127.0.0.1:5000/api/categorias')
      .then(res => res.json())
      .then(data => setCategorias(data))
      .catch(err => console.error("Error cargando categorías:", err));
  };

  useEffect(() => {
    cargarbanners();
  }, []);

  const reproducirOpening = (archivo) => {
    const ruta = `http://127.0.0.1:5000/static/assets/audio/${archivo}`;
    if (!audioRef.current) {
      audioRef.current = new Audio(ruta);
    } else {
      audioRef.current.src = ruta;
    }
    audioRef.current.play().catch(() => console.log("Interacción necesaria"));
  };

  const detenerAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  return (
    <div className="dashboard-container catalogo-container">
      {/* BARRA SUPERIOR ESTILO BÓVEDA */}
      <div className="boveda-header-container mb-5">
        <div className="boveda-header-content">
          <h1 className="boveda-header-title">CATÁLOGO</h1>
          <div className="boveda-header-actions">
            {(user?.rol === 'admin' || user?.rol === 'ayudante') && (
              <button 
                className="btn-boveda-neon" 
                onClick={() => setMostrarFormulario(!mostrarFormulario)}
              >
                {mostrarFormulario ? '✖ CANCELAR' : '＋ AÑADIR NUEVO MUNDO'}
              </button>
            )}
          </div>
        </div>
      </div>

      <button className="btn-boveda-back mb-4" onClick={() => { detenerAudio(); irADashboard(); }}>
        ← VOLVER A LA BÓVEDA
      </button>

      {/* FORMULARIO DE CARGA */}
      {mostrarFormulario && (
        <div className="formulario-desplegable mb-5 animate__animated animate__fadeInDown">
          <FormularioCategoria onCategoriaCreada={() => {
            cargarbanners();
            setMostrarFormulario(false);
          }} />
        </div>
      )}

      {/* GRILLA DE BANNERS ESTILO NEON ORANGE */}
      {!categoriaSeleccionada ? (
        <div className="row justify-content-center">
          {categorias.map((cat) => (
            <div key={cat.id} className="col-12 col-md-6 col-lg-4 mb-5">
              <div 
                className="boveda-world-card" 
                onClick={() => {
                  detenerAudio();
                  setCategoriaSeleccionada(cat);
                }}
                onMouseEnter={() => reproducirOpening(cat.path_audio)} 
                onMouseLeave={detenerAudio}
              >
                <div className="boveda-neon-frame">
                  <img 
                    src={`http://127.0.0.1:5000/static/assets/img/banners/${cat.img_banner}`} 
                    alt={cat.nombre}
                    className="boveda-img"
                  />
                  <div className="boveda-info-overlay">
                    <h2 className="boveda-name">{cat.nombre}</h2>
                    <span className="boveda-type">TIPO: {cat.tipo?.toUpperCase()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="animate__animated animate__fadeIn">
          <h2 className="text-white border-bottom border-warning pb-2">
            MUNDO: <span className="text-warning">{categoriaSeleccionada.nombre}</span>
          </h2>
          <button className="btn btn-outline-light btn-sm my-3" onClick={() => setCategoriaSeleccionada(null)}>
            ← CAMBIAR MUNDO
          </button>
          
          <div className="row mt-4">
             <p className="text-white-50">Aquí se cargarán las figuras de {categoriaSeleccionada.nombre}...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Catalogo;