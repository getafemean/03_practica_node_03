const express = require('express');
const uuid = require('uuid');

const app = express();
const port = 3000;

let clientes = [
    {id: uuid.v4(), nombre: 'gas natural', cif: 'A12345678', localidad: 'madrid'},
    {id: uuid.v4(), nombre: 'jazztel', cif: 'A87654321', localidad: 'madrid'},
    {id: uuid.v4(), nombre: 'iberdrola', cif: 'A4443241', localidad: 'bilbao'}
]

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => { // Base path del endpoint
    res.status(200).send(clientes);
})

// Get con parámetros en la url (route-params  :parametro1/:parametro2... )

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

// Get con ruta con máscara (poco utilizado)

app.get('/prov*', (req, res) => {
    res.status(200).json({
        message: 'Responde a cualquier get con ruta que comience por prov'
    })
})

// Post para crear registros

app.post('/', (req, res) => {
    if(req.body === undefined || JSON.stringify(req.body) === JSON.stringify({})) {
        return res.status(400).json({
            message: 'Datos de cliente incorrectos'
        })
    }
    let cliente = req.body;
    cliente.id = uuid.v4();                      
    cliente.localidad = cliente.localidad.toLowerCase();
    clientes.push(cliente);
    res.status(201).json({
        message: `El cliente ${cliente.nombre} ha sido registrado correctamente`,
    })
})  

// Put para actualizar (o crear) registros

app.put('/:id', (req, res) => {
    if(req.body === undefined || JSON.stringify(req.body) === JSON.stringify({})) {
        return res.status(400).json({
            message: 'Datos de cliente incorrectos'
        })
    }
    let posicion = clientes.findIndex(elem => {
        return elem.id === req.params.id;
    })
    if (posicion < 0) {
        return res.status(404).json({
            message: 'El cliente no existe'
        })
    }
    if(req.body.nombre !== undefined) {
        clientes[posicion].nombre = req.body.nombre;
    }
    if(req.body.cif !== undefined) {
        clientes[posicion].cif = req.body.cif;
    }
    if(req.body.localidad !== undefined) {
        clientes[posicion].localidad = req.body.localidad.toLowerCase();
    }
    res.status(201).json({
        message: `El cliente ${clientes[posicion].nombre} ha sido actualizado`
    })
})

// Delete elimina un registro

app.delete('/:id', (req, res) => {
    let posicion = clientes.findIndex(elem => {
        return elem.id === req.params.id;
    })
    if (posicion < 0) {
        return res.status(404).json({
            message: 'El cliente no existe'
        })
    }
    let nombreCliente = clientes[posicion].nombre;
    clientes.splice(posicion, 1);
    res.status(200).json({
        message: `El cliente ${nombreCliente} ha sido eliminado`
    })
})

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`)
})
