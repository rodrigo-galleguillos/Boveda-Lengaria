import React, { useState, useEffect, useRef } from "react";

const Tarjetas = ({ id, irAlDashboard }) => {
    const [figura, setFigura] = useState(null); 
    const [cargando, setCargando] = useState(true);
    
    // Referencia para el control de audio
    const audioRef = useRef(null);

    // --- FUNCIÓN PARA DETENER AUDIO ---
    const detenerAudio = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = "";
            audioRef.current = null;
        }
    };

    // --- 2. CONTROL DE LA PETICIÓN AL BACKEND ---
    useEffect(() => {
        if (!id) {
            console.warn("ADVERTENCIA: ID no válido.");
            return;
        }

        const obtenerDetalle = async () => {
            try {
                setCargando(true);
                const respuesta = await fetch(`http://127.0.0.1:5000/api/tarjetas/${id}`);
                
                if (respuesta.ok) {
                    const datos = await respuesta.json();
                    setFigura(datos); 
                } else {
                    console.error("Error 404: Reliquia no encontrada");
                }
            } catch (error) {
                console.error("Error de conexión:", error);
            } finally {
                setCargando(false);
            }
        };

        obtenerDetalle();

        // Cleanup al salir del componente: Matamos el audio
        return () => detenerAudio();
    }, [id]);

    // --- 3. REPRODUCCIÓN AUTOMÁTICA AL CARGAR ---
    useEffect(() => {
        // Solo si tenemos la figura y el campo de audio existe
        if (figura && figura.path_audio_producto) {
            detenerAudio(); // Limpieza previa

            const archivo = figura.path_audio_producto.toLowerCase().endsWith('.mp3') 
                ? figura.path_audio_producto 
                : `${figura.path_audio_producto}.mp3`;

            const urlFinal = `http://127.0.0.1:5000/static/assets/audio/${archivo}`;
            
            console.log("Invocando audio de detalle:", urlFinal);
            
            audioRef.current = new Audio(urlFinal);
            audioRef.current.play().catch(err => console.log("El navegador bloqueó el autoplay o archivo no encontrado"));
        }
    }, [figura]); // Se dispara cuando 'figura' deja de ser null

    if (cargando || !figura) {
        return (
            <div className="dashboard-container p-4">
                <header className="mb-4">
                    <button className="btn-boveda" onClick={() => { detenerAudio(); irAlDashboard(); }}>
                        ← Volver al Dashboard
                    </button>
                </header>
                <main className="boveda-banner d-flex align-items-center justify-content-center" style={{ minHeight: '500px' }}>
                    <h2 className="boveda-titulo text-white animate__animated animate__pulse animate__infinite">
                        {id ? "INVOCANDO LA RELIQUIA..." : "Error: ID no detectado"}
                    </h2>
                </main>
            </div>
        );
    }

    return (
        <div className="dashboard-container p-4">
            <header className="mb-4">
                <button className="btn-boveda" onClick={() => { detenerAudio(); irAlDashboard(); }}>
                    ← Volver al Dashboard
                </button>
            </header>

            <main className="boveda-banner p-0 overflow-hidden d-flex flex-column flex-md-row animate__animated animate__fadeIn" style={{ border: '1px solid #dc3545', minHeight: '500px' }}>
                
                {/* SECCIÓN VISUAL (Izquierda) */}
                <section className="col-md-5 d-flex flex-column align-items-center justify-content-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
                    <div className="marco-imagen mb-3" style={{ border: '2px solid #333', padding: '10px', background: '#111', borderRadius: '10px' }}>
                        <img 
                            src={`http://127.0.0.1:5000/static/assets/img/${figura.img}`} 
                            alt={figura.nombre} 
                            className="img-fluid"
                            style={{ maxHeight: '380px', objectFit: 'contain', filter: 'drop-shadow(0 0 15px rgba(220, 53, 69, 0.6))' }}
                            onError={(e) => { e.target.src = "https://via.placeholder.com/450?text=Imagen+Extraviada"; }}
                        />
                    </div>
                    <span className="badge border border-danger text-danger p-2 text-uppercase shadow-sm">
                        Mundo: {figura.nombre_categorias}
                    </span>
                </section>

                {/* SECCIÓN INFO (Derecha) */}
                <section className="col-md-7 p-5 d-flex flex-column justify-content-center text-white bg-dark">
                    <h1 className="boveda-titulo mb-2" style={{ fontSize: '2.8rem' }}>{figura.nombre}</h1>
                    <hr className="bg-danger mb-4" style={{ height: '3px', opacity: '1', width: '80px' }} />
                    
                    <div className="descripcion-caja mb-4">
                        <h3 className="text-danger h6 text-uppercase fw-bold mb-3" style={{ letterSpacing: '1px' }}>Reseña de la pieza:</h3>
                        <p className="opacity-75" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                            {figura.descripcion || "Los archivos de la bóveda no contienen una descripción para esta reliquia."}
                        </p>
                    </div>

                    <div className="stats-compra mt-auto">
                        <div className="d-flex justify-content-between align-items-center mb-3 border-top border-secondary pt-3">
                            <p className="m-0 fs-3 fw-bold">
                                Valor: <span className="text-danger">${figura.precio}</span>
                            </p>
                            <p className="m-0 text-muted italic">
                                Existencias: <span className="text-white">{figura.stock} unidades</span>
                            </p>
                        </div>
                        
                        <div className="d-flex align-items-center gap-3 mb-4">
                            <label className="text-uppercase small fw-bold text-danger">Cantidad a invocar:</label>
                            <input 
                                type="number" 
                                className="form-control bg-black text-white border-danger"
                                style={{ width: '85px', textAlign: 'center' }}
                                min="1" 
                                max={figura.stock} 
                                defaultValue="1"
                            />
                        </div>

                        <button className="btn-boveda w-100 py-3 fw-bold shadow-lg" style={{ fontSize: '1.3rem' }}>
                            AÑADIR A LA COLECCIÓN
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Tarjetas;