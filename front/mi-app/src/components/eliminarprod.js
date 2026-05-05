import React, { useEffect, useState } from "react";
import '../App.css';

const EliminarProd = ({ irADashboard }) => {
    // 1. Estado para almacenar la lista de figuras
    const [productos, setProductos] = useState([]);

    // 2. Lógica para CARGAR los productos desde Flask al entrar
    useEffect(() => {
        const cargarProductos = async () => {
            try {
                // Hacemos una petición GET a tu ruta de listado
                const respuesta = await fetch('http://127.0.0.1:5000/api/productos');
                if (respuesta.ok) {
                    const datos = await respuesta.json();
                    setProductos(datos); // Llenamos el estado con las figuras de la DB
                } else {
                    console.error("Error al obtener productos");
                }
            } catch (error) {
                console.error("Error de conexión:", error);
            }
        };

        cargarProductos();
    }, []); // El array vacío asegura que esto solo pase una vez

    // 3. Función para ELIMINAR en el Backend y actualizar el Frontend
    const ejecutarEliminacion = async (id) => {
        // Confirmación de seguridad
        if (!window.confirm("¿Estás seguro de que deseas eliminar esta figura de la bóveda?")) return;

        try {
            const respuesta = await fetch(`http://127.0.0.1:5000/api/eliminarproducto/${id}`, {
                method: 'DELETE',
            });
            
            if (respuesta.ok) {
                // Actualizamos el estado local filtrando el producto borrado
                // Esto hace que la tarjeta desaparezca visualmente de inmediato
                setProductos(prevProductos => prevProductos.filter(p => p.id !== id));
                alert("✅ Figura eliminada correctamente");
            } else {
                alert("❌ No se pudo eliminar el producto en el servidor");
            }
        } catch (error) {
            console.error("Error al conectar con el servidor:", error);
            alert("❌ Error de red al intentar eliminar");
        }
    };

    // 4. Estructura de la interfaz (HTML / JSX)
    return (
        <div className="admin-container">
            <header className="admin-header">
                <h1>Panel de Control: La Bóveda</h1>
                <button onClick={irADashboard} className="btn-volver">Volver al Dashboard</button>
            </header>

            <div className="productos-grid">
                {productos.length === 0 ? (
                    <p className="mensaje-vacio">No hay figuras disponibles para eliminar en este momento.</p>
                ) : (
                    productos.map((producto) => (
                        <div key={producto.id} className="producto-card">
                            <div className="producto-info">
                                <h3>{producto.nombre}</h3>
                                <p className="producto-id">ID de Catálogo: {producto.id}</p>
                            </div>
                            
                            {/* Conexión de la lógica con el evento click */}
                            <button 
                                className="btn-eliminar"
                                onClick={() => ejecutarEliminacion(producto.id)}
                            >
                                Eliminar Figura
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default EliminarProd;