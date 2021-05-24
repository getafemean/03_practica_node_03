const express = require('express');
const uuid = require('uuid');

const app = express();
const port = 3000;

let clientes = [
    {id: uuid.v4(), nombre: 'gas natural', cif: 'A12345678', localidad: 'madrid'},
    {id: uuid.v4(), nombre: 'jazztel', cif: 'A87654321', localidad: 'madrid'},
    {id: uuid.v4(), nombre: 'iberdrola', cif: 'A4443241', localidad: 'bilbao'}
]

app.get('/', (req, res) => { // Base path del endpoint
    res.status(200).send(clientes);
})

// Get con parámetros en la url

app.get('/cliente-unico/:id', (req, res) => {
    let cliente = clientes.find(elem => {
        return elem.id === req.params.id
    })
    if (cliente === undefined) {
        return res.status(404).json({
            message: 'No se encontró ningún cliente con ese id'
        })
    }
    res.status(200).json({
        cliente
    })
})

// Get con parámetros de consulta (queries-string  ruta?clave1=valor1&clave2=valor2...  )

app.get('/cliente-localidad', (req, res) => { 
    let clientesSeleccionados = [];
    clientesSeleccionados = clientes.filter(elem => {
        if(elem.localidad === req.query.localidad.toLowerCase()) {
            return elem
        }
    })
    if (clientes === undefined) {
        return res.status(404).json({
            message: 'No se encontró ningún cliente con ese id'
        })
    }
    res.status(200).json({
        clientesSeleccionados
    })
})

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`)
})
