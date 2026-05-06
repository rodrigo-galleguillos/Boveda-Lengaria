import React, { useEffect, useState } from "react";
import '../App.css';

const EliminarProd = ({ irAlDashboard }) => {
    const [productos, setProductos] = useState([]);

    // 1. CARGAMOS LOS PRODUCTOS (Al iniciar el componente)
    useEffect(() => {
        fetch('http://127.0.0.1:5000/api/inicio')
            .then(res => res.json())
            .then(data => {
                // Verificamos que data sea un array antes de guardarlo
                if (Array.isArray(data)) {
                    setProductos(data);
                }
            })
            .catch(err => console.error("Error al cargar la Bóveda:", err));
    }, []);

    // 2. FUNCIÓN PARA ELIMINAR (Acción del usuario)
    const ejecutarEliminacion = (id) => {
        if (window.confirm("¿Estás seguro de que querés borrar esta figura de la Bóveda?")) {
            fetch(`http://127.0.0.1:5000/api/eliminarproducto/${id}`, {
                method: 'DELETE',
            })
            .then(res => res.json())
            .then(data => {
                // Mostramos el mensaje que viene de Flask (éxito o error)
                alert(data.message || data.error);
                
                // 3. ACTUALIZACIÓN OPTIMISTA: Quitamos el producto de la lista visual
                if (!data.error) {
                    setProductos(productos.filter(p => p.id !== id));
                }
            })
            .catch(err => console.error("Error en la petición DELETE:", err));
        }
    };

    // 4. ESTRUCTURA DE LA INTERFAZ
    return (
        <div className="admin-container">
            <header className="admin-header">
                <h1 className="boveda-titulo">Panel de Control: La Bóveda</h1>
                {/* Usamos irADashboard que es la prop que entra al componente */}
                <button onClick={irAlDashboard} className="btn-boveda" style={{width: 'auto'}}>
                    Volver al Dashboard
                </button>
            </header>

            <div className="productos-grid mt-4">
                {productos.length === 0 ? (
                    <p className="text-white">No hay figuras disponibles para eliminar en este momento.</p>
                ) : (
                    <div className="row">
                        {productos.map((producto) => (
                            <div key={producto.id} className="col-md-4 mb-3">
                                <div className="boveda-banner p-3 d-flex flex-column h-100">
                                    <div className="producto-info flex-grow-1">
                                        <h3 className="h5 text-white">{producto.nombre}</h3>
                                        <p className="text-muted small">ID de Catálogo: {producto.id}</p>
                                    </div>
                                    
                                    <button 
                                        className="btn btn-danger btn-sm w-100 mt-2"
                                        onClick={() => ejecutarEliminacion(producto.id)}
                                    >
                                        🗑️ Eliminar Figura
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};


export default EliminarProd;