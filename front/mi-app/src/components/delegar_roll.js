import React, { useState, useEffect } from 'react';

const DelegarRoll = ({ irAlDashboard }) => {
    const [usuarios, setUsuarios] = useState([]);
    const [cargando, setCargando] = useState(true);

    // Colores exactos de tu proyecto (Rojo Neón)
    const rojoNeon = '#ff3131';

    const obtenerUsuarios = async () => {
        try {
            setCargando(true);
            const response = await fetch('http://localhost:5000/api/usuarios');
            const data = await response.json();
            setUsuarios(data);
        } catch (error) {
            console.error("Error al obtener usuarios:", error);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        obtenerUsuarios();
    }, []);

    // FUNCIÓN DE ACTUALIZACIÓN CON CONTRASEÑA DE ADMIN
    const ejecutarCambioSeguro = async (idUsuario, campo, nuevoValor) => {
        // Validación de seguridad para el Admin
        const adminPass = window.prompt("SEGURIDAD: Ingrese su contraseña de Administrador para confirmar el cambio:");
        
        if (!adminPass) {
            alert("Acción cancelada. Se requiere validación de administrador.");
            return;
        }

        // Mapeo exacto según tu base de datos (con 'n' para contrasena)
        let nombreColumnaDB = campo;
        if (campo === 'mail') nombreColumnaDB = 'mail';
        if (campo === 'password') nombreColumnaDB = 'contrasena'; // <--- Ajustado a 'contrasena' con n

        const bodyCarga = {
            permisosrol: "admin",
            admin_password_confirm: adminPass, 
            id_usuario: idUsuario,
            [nombreColumnaDB]: nuevoValor
        };

        try {
            const response = await fetch('http://localhost:5000/api/datos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyCarga)
            });

            const resultado = await response.json();

            if (response.ok) {
                alert("✅ La Bóveda ha sido actualizada.");
                obtenerUsuarios();
            } else {
                alert("❌ " + (resultado.error || "Error al procesar el cambio"));
            }
        } catch (error) {
            alert("❌ Error crítico de conexión.");
        }
    };

    return (
        <div style={{ padding: '30px', backgroundColor: '#000', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif' }}>
            
            {/* Botón de Retorno */}
            <button 
                onClick={irAlDashboard}
                style={{ 
                    backgroundColor: 'transparent', border: `1px solid ${rojoNeon}`, boxShadow: `0 0 10px ${rojoNeon}`,
                    color: 'white', padding: '10px 20px', cursor: 'pointer', borderRadius: '5px', marginBottom: '20px', fontWeight: 'bold'
                }}
            >
                ← VOLVER AL DASHBOARD
            </button>

            {/* Cabecera Estilo Neón */}
            <div style={{ 
                border: `2px solid ${rojoNeon}`, boxShadow: `0 0 20px ${rojoNeon}`, borderRadius: '15px',
                padding: '20px', textAlign: 'center', marginBottom: '40px', backgroundColor: 'rgba(255, 49, 49, 0.05)'
            }}>
                <h1 style={{ color: rojoNeon, margin: 0, letterSpacing: '3px', textShadow: `0 0 10px ${rojoNeon}` }}>
                    DELEGACIÓN DE ROLES - LA BÓVEDA LEGENDARIA
                </h1>
            </div>

            {cargando ? (
                <p style={{ color: rojoNeon, textAlign: 'center' }}>Sincronizando registros...</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {usuarios.map((u) => {
                        const esAyudante = u.rol?.toLowerCase() === 'ayudante';
                        const esAdmin = u.rol?.toLowerCase() === 'admin';

                        return (
                            <div key={u.id} style={{ 
                                backgroundColor: '#111', border: `2px solid ${rojoNeon}`, boxShadow: `0 0 8px ${rojoNeon}`,
                                borderRadius: '12px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                            }}>
                                {/* Información del Usuario */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <span style={{ color: rojoNeon, fontSize: '12px', fontWeight: 'bold' }}>ID: {u.id}</span>
                                    <strong style={{ fontSize: '20px', letterSpacing: '1px' }}>{u.nombre?.toUpperCase()}</strong>
                                    
                                    <span 
                                        onClick={() => {
                                            const v = window.prompt("Nuevo mail:", u.mail);
                                            if(v) ejecutarCambioSeguro(u.id, 'mail', v);
                                        }}
                                        style={{ color: '#aaa', fontSize: '14px', cursor: 'pointer', textDecoration: 'underline' }}
                                    >
                                        📩 {u.mail || 'Asignar mail'}
                                    </span>

                                    <span 
                                        onClick={() => {
                                            const v = window.prompt("Nueva Contraseña para este usuario:");
                                            if(v) ejecutarCambioSeguro(u.id, 'password', v);
                                        }}
                                        style={{ color: '#444', fontSize: '12px', cursor: 'pointer' }}
                                    >
                                        🔑 [ Editar Contraseña ]
                                    </span>
                                </div>

                                {/* Acciones de Rol */}
                                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <div style={{ 
                                        color: rojoNeon, fontWeight: 'bold', fontSize: '14px', border: `1px solid ${rojoNeon}`,
                                        padding: '5px 10px', borderRadius: '5px', display: 'inline-block', backgroundColor: 'rgba(255, 49, 49, 0.1)'
                                    }}>
                                        {u.rol?.toUpperCase()}
                                    </div>
                                    
                                    {!esAdmin && (
                                        <button 
                                            onClick={() => {
                                                const proximoRol = esAyudante ? 'user' : 'ayudante';
                                                ejecutarCambioSeguro(u.id, 'rol', proximoRol);
                                            }}
                                            style={{ 
                                                backgroundColor: esAyudante ? '#333' : rojoNeon, 
                                                color: 'white', border: 'none', padding: '10px 20px',
                                                borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', 
                                                boxShadow: esAyudante ? 'none' : `0 0 15px ${rojoNeon}`
                                            }}
                                        >
                                            {esAyudante ? 'QUITAR RANGO' : 'HACER AYUDANTE'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default DelegarRoll;