import React, { useState, useEffect } from "react";

const Tarjetas = ({ id, irAlDashboard }) => {
    // 1. Estados iniciales
    const [figura, setFigura] = useState(null); 
    const [cargando, setCargando] = useState(true);

    // 2. Control de la petición al Backend
    useEffect(() => {
        if (!id) {
            console.warn("ADVERTENCIA: Se intentó cargar la tarjeta sin un ID válido.");
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
                    console.error("La Bóveda no encontró esa reliquia (Error 404)");
                }
            } catch (error) {
                console.error("Error al conectar con la bóveda:", error);
            } finally {
                setCargando(false);
            }
        };

        obtenerDetalle();
    }, [id]); 

    // 3. Pantalla de Carga
    if (cargando || !figura) {
        return (
            <div className="dashboard-container p-4">
                <header className="mb-4">
                    <button className="btn-boveda" onClick={irAlDashboard}>
                        ← Volver al Dashboard
                    </button>
                </header>
                <main className="boveda-banner d-flex align-items-center justify-content-center" style={{ minHeight: '500px' }}>
                    <h2 className="boveda-titulo text-white">
                        {id ? "Invocando la reliquia..." : "Error: ID no detectado"}
                    </h2>
                </main>
            </div>
        );
    }

    // 4. Renderizado Final: Usando variables corregidas (figura.img)
    return (
        <div className="dashboard-container p-4">
            
            <header className="mb-4">
                <button className="btn-boveda" onClick={irAlDashboard}>
                    ← Volver al Dashboard
                </button>
            </header>

            <main className="boveda-banner p-0 overflow-hidden d-flex flex-column flex-md-row" style={{ border: '1px solid #dc3545', minHeight: '500px' }}>
                
                {/* SECCIÓN VISUAL (Izquierda) */}
                <section className="col-md-5 d-flex flex-column align-items-center justify-content-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
                    <div className="marco-imagen mb-3" style={{ border: '2px solid #333', padding: '10px', background: '#111', borderRadius: '10px' }}>
                        <img 
                            // CORRECCIÓN: Usamos .img que es lo que devuelve el backend
                            src={`http://127.0.0.1:5000/static/assets/img/${figura.img}`} 
                            alt={figura.nombre} 
                            className="img-fluid"
                            style={{ maxHeight: '380px', objectFit: 'contain', filter: 'drop-shadow(0 0 10px rgba(220, 53, 69, 0.5))' }}
                            onError={(e) => { e.target.src = "https://via.placeholder.com/450?text=Imagen+Extraviada"; }}
                        />
                    </div>
                    <span className="badge border border-danger text-danger p-2 text-uppercase">
                        {figura.nombre_categorias}
                    </span>
                </section>

                {/* SECCIÓN INFO (Derecha) */}
                <section className="col-md-7 p-5 d-flex flex-column justify-content-center text-white bg-dark">
                    <h1 className="boveda-titulo mb-2" style={{ fontSize: '2.8rem' }}>{figura.nombre}</h1>
                    <hr className="bg-danger mb-4" style={{ height: '2px', opacity: '1', width: '100px' }} />
                    
                    <div className="descripcion-caja mb-4">
                        <h3 className="text-danger h6 text-uppercase fw-bold mb-3">Reseña de la pieza:</h3>
                        <p className="opacity-75" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                            {figura.descripcion || "Los archivos de la bóveda no contienen una descripción para esta reliquia."}
                        </p>
                    </div>

                    <div className="stats-compra mt-auto">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <p className="m-0 fs-3 fw-bold">
                                Precio: <span className="text-danger">${figura.precio}</span>
                            </p>
                            <p className="m-0 text-muted">
                                Disponibles: <span className="text-white">{figura.stock} unidades</span>
                            </p>
                        </div>
                        
                        <div className="d-flex align-items-center gap-3 mb-4">
                            <label className="text-uppercase small fw-bold">Cantidad:</label>
                            <input 
                                type="number" 
                                className="form-control bg-transparent text-white border-danger"
                                style={{ width: '80px', textAlign: 'center' }}
                                min="1" 
                                max={figura.stock} 
                                defaultValue="1"
                            />
                        </div>

                        <button className="btn-boveda w-100 py-3 fw-bold" style={{ fontSize: '1.3rem' }}>
                            AÑADIR A LA COLECCIÓN
                        </button>
                    </div>
                </section>

            </main>
        </div>
    );
};

export default Tarjetas;