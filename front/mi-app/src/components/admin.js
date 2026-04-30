import React, { useState, useEffect } from 'react';

const AdminPanel = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [usuarioOriginal, setUsuarioOriginal] = useState(null); // Para comparar
    const [formEdicion, setFormEdicion] = useState(null); // Lo que el Admin escribe

    // 1. Cargar usuarios al entrar
    useEffect(() => {
        fetch('http://127.0.0.1:5000/api/admin/usuarios')
            .then(res => res.json())
            .then(data => setUsuarios(data));
    }, []);

    // 2. Al hacer clic en Editar
    const seleccionarUsuario = (u) => {
        setUsuarioOriginal(u); // Guardamos la "foto" original
        setFormEdicion({ ...u }); // Cargamos los inputs con esos datos
    };

    // 3. Detectar cambios y enviar a Flask
    const guardarCambios = async () => {
        const cambios = {};
        
        // Comparamos el formulario vs el original
        Object.keys(formEdicion).forEach(campo => {
            if (formEdicion[campo] !== usuarioOriginal[campo]) {
                cambios[campo] = formEdicion[campo];
            }
        });

        if (Object.keys(cambios).length === 0) return alert("No hay cambios");

        // Agregamos el ID que Flask necesita para el WHERE
        cambios.id_usuario = usuarioOriginal.id;

        const res = await fetch('http://127.0.0.1:5000/api/admin/actualizar-usuario', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cambios)
        });

        if (res.ok) alert("¡Actualizado!");
    };

    return (
        <div className="admin-container">
            <h2>Gestión de Usuarios</h2>
            {/* Tabla de Usuarios */}
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Mail</th>
                        <th>Rol</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map(u => (
                        <tr key={u.id}>
                            <td>{u.nombre}</td>
                            <td>{u.mail}</td>
                            <td>{u.rol}</td>
                            <td><button onClick={() => seleccionarUsuario(u)}>Editar</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Formulario que aparece solo al editar */}
            {formEdicion && (
                <div className="modal-edicion">
                    <h3>Editando a: {usuarioOriginal.nombre}</h3>
                    <input 
                        value={formEdicion.nombre} 
                        onChange={e => setFormEdicion({...formEdicion, nombre: e.target.value})} 
                    />
                    <input 
                        value={formEdicion.rol} 
                        onChange={e => setFormEdicion({...formEdicion, rol: e.target.value})} 
                    />
                    {/* ... Agregá los 10 inputs acá ... */}
                    <button onClick={guardarCambios}>Guardar</button>
                    <button onClick={() => setFormEdicion(null)}>Cancelar</button>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;