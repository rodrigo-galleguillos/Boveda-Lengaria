import React, { useState } from 'react';

const FormularioCategoria = ({ onCategoriaCreada }) => {
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('anime'); // Agregamos el tipo que pide tu DB
  const [imagen, setImagen] = useState(null);
  const [audio, setAudio] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Usamos FormData para poder enviar archivos binarios
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('tipo', tipo);
    formData.append('imagen', imagen); // El archivo de imagen
    formData.append('audio', audio);   // El archivo de audio

    try {
      const res = await fetch('http://127.0.0.1:5000/api/categorias/nueva', {
        method: 'POST',
        body: formData 
      });

      if (res.ok) {
        alert("¡Mundo de anime creado exitosamente!");
        // Limpiamos el formulario
        setNombre('');
        setTipo('anime');
        setImagen(null);
        setAudio(null);
        e.target.reset(); // Resetea los inputs de archivo
        
        onCategoriaCreada(); // Avisa al catálogo que refresque
      } else {
        const errorData = await res.json();
        alert("Error: " + errorData.message);
      }
    } catch (error) {
      console.error("Error en el envío:", error);
    }
  };

  return (
    <div className="bg-dark p-4 rounded border border-danger mb-5">
      <h3 className="text-white text-center">Registrar Nuevo Mundo</h3>
      <form onSubmit={handleSubmit}>
        <label className="text-white-50">Nombre del Anime:</label>
        <input className="form-control mb-2" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        
        <label className="text-white-50">Tipo:</label>
        <select className="form-control mb-2" value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="anime">Anime</option>
          <option value="manga">Manga</option>
          <option value="movie">Película</option>
        </select>

        <label className="text-white-50">Banner del Mundo (Imagen):</label>
        <input type="file" className="form-control mb-2" accept="image/*" onChange={(e) => setImagen(e.target.files[0])} required />

        <label className="text-white-50">Opening / Soundtrack (Audio):</label>
        <input type="file" className="form-control mb-2" accept="audio/*" onChange={(e) => setAudio(e.target.files[0])} required />

        <button type="submit" className="btn btn-danger w-100 mt-3">FORJAR CATEGORÍA</button>
      </form>
    </div>
  );
};

export default FormularioCategoria;