import React, { useState } from "react";

const CargaProd = ({ irAlDashboard }) => {
    // Estados para controlar el formulario
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [precio, setPrecio] = useState('');
    const [stock, setStock] = useState('');
    const [nombreCat, setNombreCat] = useState('');
    const [tipoCat, setTipoCat] = useState('');
    const [cargando, setCargando] = useState(false);

    // Estados para los archivos físicos reales
    const [archivoImagen, setArchivoImagen] = useState(null);
    const [archivoAudio, setArchivoAudio] = useState(null);
    
    // Estados solo para mostrar el nombre del archivo seleccionado en la interfaz
    const [nombreArchivoImagen, setNombreArchivoImagen] = useState('');
    const [nombreArchivoAudio, setNombreArchivoAudio] = useState('');

    // --- CONFIGURACIÓN ESTÉTICA (Definidas para que no den error) ---
    const rojoNeon = "#ff4d4d";
    const fondoTarjeta = "#1e2125";
    const fondoInput = "#2c3035";

    const estiloInput = {
        backgroundColor: fondoInput,
        border: "1px solid #444",
        color: "white",
        height: "48px"
    };

    const estiloLabel = {
        color: rojoNeon,
        fontWeight: "bold",
        textTransform: "uppercase",
        fontSize: "0.75rem",
        letterSpacing: "1px"
    };

    // Manejadores para capturar los archivos reales y sus nombres
    const manejarCambioImagen = (e) => {
        const archivo = e.target.files[0];
        if (archivo) {
            setArchivoImagen(archivo); // Guardamos el archivo binario para enviar
            setNombreArchivoImagen(archivo.name); // Guardamos el nombre para mostrar
        }
    };

    const manejarCambioAudio = (e) => {
        const archivo = e.target.files[0];
        if (archivo) {
            setArchivoAudio(archivo); // Guardamos el archivo binario para enviar
            setNombreArchivoAudio(archivo.name); // Guardamos el nombre para mostrar
        }
    };

    const enviarDatos = async (e) => {
        e.preventDefault();
        setCargando(true);

        // Usamos FormData para enviar archivos binarios
        const formData = new FormData();
        formData.append('nombre', nombre);
        formData.append('descripcion', descripcion);
        formData.append('precio', precio);
        formData.append('stock', stock);
        formData.append('nombre_cat', nombreCat);
        formData.append('tipo_cat', tipoCat);
        
        // Adjuntamos los archivos reales si existen
        if (archivoImagen) formData.append('imagen', archivoImagen);
        if (archivoAudio) formData.append('audio', archivoAudio);

        try {
            const respuesta = await fetch('http://127.0.0.1:5000/api/cargaproductos', {
                method: 'POST',
                // IMPORTANTE: No enviar headers de Content-Type aquí
                body: formData 
            });

            if (respuesta.ok) {
                alert("✨ ¡Reliquia forjada con éxito en la Bóveda!");
                irAlDashboard();
            } else {
                const errorData = await respuesta.json();
                alert(errorData.error || "Error al cargar la figura");
            }
        } catch (error) {
            alert("❌ Error de conexión con el servidor");
        } finally {
            setCargando(false);
        }
    };

    return (
        <div style={{ backgroundColor: "#121417", minHeight: "100vh", padding: "40px 0" }}>
            <div className="container">
                <button 
                    onClick={irAlDashboard} 
                    className="btn btn-link text-decoration-none shadow-none" 
                    style={{ color: "#555", fontWeight: "bold", fontSize: "0.8rem", marginBottom: "20px" }}
                >
                    ← VOLVER AL DASHBOARD
                </button>

                <div className="row justify-content-center">
                    <div className="col-md-9">
                        <div className="card shadow-lg" style={{ backgroundColor: fondoTarjeta, border: `2px solid ${rojoNeon}`, borderRadius: "20px", padding: "30px" }}>
                            
                            <div className="text-center mb-4">
                                <h2 className="text-white fw-bold" style={{ letterSpacing: "2px" }}>
                                    <span style={{ color: rojoNeon }}>⛩</span> CARGA DE PRODUCTO
                                </h2>
                            </div>

                            <form onSubmit={enviarDatos}>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label style={estiloLabel}>Nombre del Producto</label>
                                        <input type="text" className="form-control shadow-none" style={estiloInput} value={nombre} onChange={(e) => setNombre(e.target.value)} required placeholder="ej: Asta" />
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <label style={estiloLabel}>Precio</label>
                                        <input type="number" className="form-control shadow-none" style={estiloInput} value={precio} onChange={(e) => setPrecio(e.target.value)} required placeholder="0.00" />
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <label style={estiloLabel}>Stock</label>
                                        <input type="number" className="form-control shadow-none" style={estiloInput} value={stock} onChange={(e) => setStock(e.target.value)} required placeholder="1" />
                                    </div>
                                    
                                    <div className="col-12 mb-3">
                                        <label style={estiloLabel}>Descripción</label>
                                        <textarea className="form-control shadow-none" style={{ ...estiloInput, height: "auto" }} rows="2" value={descripcion} onChange={(e) => setDescripcion(e.target.value)}></textarea>
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label style={estiloLabel}>Serie / Anime</label>
                                        <input type="text" className="form-control shadow-none" style={estiloInput} value={nombreCat} onChange={(e) => setNombreCat(e.target.value)} required placeholder="ej: Black Clover" />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label style={estiloLabel}>Tipo</label>
                                        <select className="form-select shadow-none" style={estiloInput} value={tipoCat} onChange={(e) => setTipoCat(e.target.value)} required>
                                            <option value="" disabled hidden>Seleccionar...</option>
                                            <option style={{backgroundColor: fondoTarjeta}} value="Anime">Anime</option>
                                            <option style={{backgroundColor: fondoTarjeta}} value="Manga">Manga</option>
                                        </select>
                                    </div>

                                    {/* --- CAMPO DE IMAGEN (Añadido aquí) --- */}
                                    <div className="col-md-6 mb-3">
                                        <label style={estiloLabel}>Imagen de la Figura</label>
                                        <label 
                                            htmlFor="image-file" 
                                            className="form-control shadow-none d-flex align-items-center" 
                                            style={{ ...estiloInput, cursor: "pointer", overflow: "hidden", whiteSpace: "nowrap" }}
                                        >
                                            <span style={{ color: nombreArchivoImagen ? "white" : "#888" }}>
                                                {nombreArchivoImagen ? `🖼️ ${nombreArchivoImagen}` : "Seleccionar Imagen..."}
                                            </span>
                                        </label>
                                        <input id="image-file" type="file" onChange={manejarCambioImagen} style={{ display: "none" }} accept="image/*" required />
                                    </div>

                                    {/* --- CAMPO DE AUDIO --- */}
                                    <div className="col-md-6 mb-3">
                                        <label style={estiloLabel}>Audio de la Figura</label>
                                        <label 
                                            htmlFor="audio-file" 
                                            className="form-control shadow-none d-flex align-items-center" 
                                            style={{ ...estiloInput, cursor: "pointer", overflow: "hidden", whiteSpace: "nowrap" }}
                                        >
                                            <span style={{ color: nombreArchivoAudio ? "white" : "#888" }}>
                                                {nombreArchivoAudio ? `🎵 ${nombreArchivoAudio}` : "Seleccionar Audio..."}
                                            </span>
                                        </label>
                                        <input id="audio-file" type="file" onChange={manejarCambioAudio} style={{ display: "none" }} accept="audio/*" required />
                                    </div>
                                </div>

                                <div className="d-grid mt-4">
                                    <button 
                                        type="submit" 
                                        className="btn btn-lg fw-bold text-white" 
                                        disabled={cargando}
                                        style={{ backgroundColor: rojoNeon, borderRadius: "10px", textTransform: "uppercase" }}
                                    >
                                        {cargando ? 'Forjando...' : 'ENTRAR A LA BÓVEDA'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CargaProd;