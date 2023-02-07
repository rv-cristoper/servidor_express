import express from 'express'
import ProductController from './ProductController.js'

const app = express()


app.get('/products', ProductController.getProducts);
app.get('/products/:pid', ProductController.getProductByID);


const PORT = 8080
const server = app.listen(PORT, () => {
    console.log('Servidor ejecutandose en el puerto: ', PORT)
})
server.on('error', error => console.log('Error en el servidor', error))