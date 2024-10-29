const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors()); // Habilitar CORS para permitir solicitudes de otros orígenes
app.use(bodyParser.json());

// Configuración de la base de datos MySQL en Hostinger
const dbConfig = {
    host: 'srv1529.hstgr.io',
    user: 'u580509106_devloper',
    password: 'Devloper2.',
    database: 'u580509106_licencias',
    connectTimeout: 10000 // Aumenta el tiempo de espera de conexión a 10 segundos
};

let db;

// Función para manejar la conexión y reconexión a la base de datos
function handleDisconnect() {
    db = mysql.createConnection(dbConfig);

    db.connect((err) => {
        if (err) {
            console.error('Error al conectar con la base de datos:', err);
            setTimeout(handleDisconnect, 2000); // Reintenta la conexión después de 2 segundos
        } else {
            console.log('Conectado a la base de datos MySQL en Hostinger');
        }
    });

    db.on('error', (err) => {
        console.error('Error en la base de datos:', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET') {
            handleDisconnect(); // Reconecta automáticamente en caso de pérdida de conexión
        } else {
            throw err; // Lanza otros errores que no se pueden manejar automáticamente
        }
    });
}

// Inicializa la conexión
handleDisconnect();

// Ruta para consultar una licencia (POST)
app.post('/api/consultar-licencia', (req, res) => {
    const { tipo_documento, numero_documento } = req.body;

    console.log("Datos recibidos (POST):", { tipo_documento, numero_documento });

    if (!tipo_documento || !numero_documento) {
        return res.status(400).json({
            success: false,
            message: 'Faltan parámetros: tipo_documento y numero_documento son necesarios'
        });
    }

    const query = 'SELECT * FROM licencias WHERE tipo_documento = ? AND numero_documento = ?';

    db.query(query, [tipo_documento, numero_documento], (err, result) => {
        if (err) {
            console.error('Error en la consulta (POST):', err.message);
            return res.status(500).json({ success: false, message: 'Error en la consulta' });
        }
        
        if (result.length > 0) {
            res.json({
                success: true,
                message: 'Licencia encontrada 😊',
                data: result[0]
            });
        } else {
            res.json({ success: false, message: 'No se encontró la licencia 😢' });
        }
    });
});

// Ruta para consultar una licencia (GET)
app.get('/api/consultar-licencia', (req, res) => {
    const tipo_documento = req.query.tipo_documento; // Usar query params
    const numero_documento = req.query.numero_documento;

    console.log("Datos recibidos (GET):", { tipo_documento, numero_documento });

    if (!tipo_documento || !numero_documento) {
        return res.status(400).json({
            success: false,
            message: 'Faltan parámetros: tipo_documento y numero_documento son necesarios'
        });
    }

    const query = 'SELECT * FROM licencias WHERE tipo_documento = ? AND numero_documento = ?';

    db.query(query, [tipo_documento, numero_documento], (err, result) => {
        if (err) {
            console.error('Error en la consulta (GET):', err.message);
            return res.status(500).json({ success: false, message: 'Error en la consulta' });
        }
        
        if (result.length > 0) {
            res.json({
                success: true,
                message: 'Licencia encontrada 😊',
                data: result[0]
            });
        } else {
            res.json({ success: false, message: 'No se encontró la licencia 😢' });
        }
    });
});

// Enviar una consulta periódica para mantener la conexión activa
setInterval(() => {
    if (db) {
        db.query('SELECT 1', (err) => {
            if (err) console.error('Error en la consulta de mantenimiento:', err);
        });
    }
}, 5000); // Envía una consulta cada 5 segundos

// Iniciar el servidor
const PORT = 3006;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
