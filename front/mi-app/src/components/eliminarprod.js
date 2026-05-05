const eliminarProducto = async (id) => {
  // 1. Confirmación (para que no borre sin querer)
  if (!window.confirm("¿Deseas eliminar esta figura de la bóveda?")) return;

  try {
    // 2. Fetch con la sintaxis de variables correcta
    const respuesta = await fetch(`http://127.0.0.1:5000/api/eliminarproducto/${id}`, {
      method: 'DELETE',
    });

    if (respuesta.ok) {
      // 3. Filtrado del estado para que desaparezca de la vista
      const listaActualizada = productos.filter(p => p.id !== id);
      setProductos(listaActualizada);
      
      alert("✅ Producto eliminado exitosamente");
      irADashboard(); // Ejecutamos la función para volver
    } else {
      alert("❌ Error al eliminar el producto");
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    setProductoSeleccionado(null);
  }

  return (
  <div className="admin-container">
    <header className="admin-header">
      <h1>Panel de Control: La Bóveda</h1>
      <button onClick={irADashboard} className="btn-volver">Volver</button>
    </header>

    <div className="productos-grid">
      {productos.length === 0 ? (
        <p>No hay figuras en la bóveda...</p>
      ) : (
        productos.map((producto) => (
          <div key={producto.id} className="producto-card">
            {/* Si tenés imagen, podrías poner un <img src={producto.url} /> */}
            <div className="producto-info">
              <h3>{producto.nombre}</h3>
              <p>ID: {producto.id}</p>
            </div>
            
            {/* ESPACIO LÓGICO: Conectá aquí tu función eliminarProducto */}
            <button 
              className="btn-eliminar"
              onClick={() => { /* Tu lógica aquí pasándole el producto.id */ }}
            >
              Eliminar Figura
            </button>
          </div>
        ))
      )}
    </div>
  </div>
);
}; // <- ¡No te olvides de cerrar esta llave!