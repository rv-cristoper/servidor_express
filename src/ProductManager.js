import fs from 'fs'
import { promises as fsPromises } from 'fs'

class ProductManager {

    constructor(filename = 'example') {
        this.fileName = `./${filename}.txt`;
    }

    validateAddProduct(product) {
        if (product.hasOwnProperty('title') && product.hasOwnProperty('description') && product.hasOwnProperty('price') && product.hasOwnProperty('thumbnail') && product.hasOwnProperty('code') && product.hasOwnProperty('stock')) {
            if (product.title.trim() && product.description.trim() && product.price.toString().trim() && product.thumbnail.trim() && product.code.trim() && product.stock.toString().trim()) {
                return true;
            }
            console.log('Error al agregar')
            console.log(product)
            console.log('Verifique que el producto no cuente con datos vacios')
            return false;
        }
        console.log('Error al agregar')
        console.log(product)
        console.log('Verifique que el producto cuente con los siguientes campos (title, description, price, thumbnail, code y stock)')
        return false;
    }

    async addProduct(product) {
        const validate = this.validateAddProduct(product);
        let products = [];
        if (!validate) return;
        if (fs.existsSync(this.fileName)) {
            await fsPromises.readFile(this.fileName, 'utf-8')
                .then(function (result) {
                    products = JSON.parse(result)
                })
                .catch(function (error) {
                    console.log(error);
                })
            const exists = products.find(element => element.code === product.code);
            if (exists) {
                console.log(`El producto [ ${product.title} ] no se puedo registrar ya que el código [ ${product.code} ] se encuentra registrado`)
                return;
            }
        }
        product.id = products.length + 1;
        products.push(product)
        try {
            await fsPromises.writeFile(this.fileName, JSON.stringify(products))
            console.log(`El producto [ ${product.title} ] fue agregado de manera exitosa`)
            return;
        } catch (error) {
            console.error(error);
        }

    }

    async getProducts() {
        let products = [];
        if (fs.existsSync(this.fileName)) {
            await fsPromises.readFile(this.fileName, 'utf-8')
                .then(function (result) {
                    products = JSON.parse(result)
                })
                .catch(function (error) {
                    console.log(error);
                })
        }
        console.log(products)
        return products;
    }

    async getProductById(id) {
        console.log(`Buscando producto con id [ ${id} ]`)
        const message = `El producto no existe`;
        if (!fs.existsSync(this.fileName)) {
            console.log(message)
            return message
        }
        let products = [];
        await fsPromises.readFile(this.fileName, 'utf-8')
            .then(function (result) {
                products = JSON.parse(result)
            })
            .catch(function (error) {
                console.log(error);
            })
        const product = products.find(element => element.id === id);
        if (!product) {
            console.log(message)
            return message
        }
        console.log(product)
        return product;
    }

    async updateProducts(id, data) {
        const product = await this.getProductById(id)
        if (typeof product === 'string') return;
        let products = [];
        await fsPromises.readFile(this.fileName, 'utf-8')
            .then(function (result) {
                products = JSON.parse(result)
            })
            .catch(function (error) {
                console.log(error);
            })
        if (data.id) {
            console.log(`No esta permitido actualizar el id del producto [ ${product.title} ]. Campos permitidos (title, description, price, thumbnail, code, stock)`)
            return;
        }
        if (data.code) {
            const exists = products.find(element => element.code === data.code);
            if (exists && exists.id !== product.id) {
                console.log(`No se puede actualizar el código del producto [ ${product.title} ] ya que el código [ ${data.code} ] se encuentra registrado en otro producto`)
                return;
            }
        }
        const validate = ["title", "description", "price", "thumbnail", "code", "stock"];
        let error = false;
        Object.keys(data).forEach((element) => {
            if (!validate.includes(element)) {
                error = true;
            }
        });
        if (error) {
            console.log(`No se puede actualizar el producto [ ${product.title} ]. Campos permitidos (title, description, price, thumbnail, code, stock)`)
            return;
        }
        products = products.map(element => {
            if (element.id === id) {
                return {
                    ...element,
                    ...data,
                    id: element.id
                }
            }
            return element
        });
        try {
            await fsPromises.writeFile(this.fileName, JSON.stringify(products))
            console.log(`El producto [ ${product.title} ] fue actualizado de manera exitosa`)
            console.log(products.find(element => element.id === id))
            return;
        } catch (error) {
            console.error(error);
        }
    }

    async deleteProductById(id) {
        console.log(`Buscando producto con id [ ${id} ]`)
        if (!fs.existsSync(this.fileName)) return console.log(`El producto no existe`)
        let products = [];
        await fsPromises.readFile(this.fileName, 'utf-8')
            .then(function (result) {
                products = JSON.parse(result)
            })
            .catch(function (error) {
                console.log(error);
            })
        const product = products.find(element => element.id === id);
        if (!product) return console.log(`El producto no existe`)
        products = products.filter(element => element.id !== id)
        try {
            await fsPromises.writeFile(this.fileName, JSON.stringify(products))
            console.log(product)
            return console.log(`El producto ${product.title} fue eliminado de manera exitosa`);
        } catch (error) {
            console.error(error);
        }

    }
}

export default ProductManager;

// console.log('--- CRISTOPER TESTING---')

// const main = async () => {

//     const manager = new ProductManager();

//     console.log('')
//     console.log('--- AGREGANDO PRODUCTOS ---')
//     console.log('')

//     await manager.addProduct({
//         title: "Laptop",
//         description: "Laptop HP ultima generación",
//         price: 5400,
//         thumbnail: "https://www.imagen.com",
//         code: "sdf12",
//         stock: 10,
//     })
//     await manager.addProduct({
//         title: "Tablet",
//         description: "Tablet HP ultima generación",
//         price: 250,
//         thumbnail: "https://www.imagen.com",
//         code: "sdf121",
//         stock: 11,
//     })
//     await manager.addProduct({
//         title: "Cooler",
//         description: "Cooler HP ultima generación",
//         price: 100,
//         thumbnail: "https://www.imagen.com",
//         code: "sdf124",
//         stock: 23,
//     })
//     await manager.addProduct({
//         title: "TV",
//         description: "TV sonic ultima generación",
//         price: 1200,
//         thumbnail: "https://www.imagen.com",
//         code: "sdf1211",
//         stock: 20,
//     })
//     await manager.addProduct({
//         title: "Teléfono",
//         description: "Teléfono huawei ultima generación",
//         price: 700,
//         thumbnail: "https://www.imagen.com",
//         code: "sdf123",
//         stock: 15,
//     })
//     await manager.addProduct({
//         title: "Reloj",
//         description: "Reloj alpha ultima generación",
//         price: 500,
//         thumbnail: "https://www.imagen.com",
//         code: "sdf122",
//         stock: 23,
//     })
//     await manager.addProduct({
//         title: "Escritorio",
//         description: "Escritorio de madera",
//         price: 200,
//         thumbnail: "https://www.imagen.com",
//         code: "bawr1",
//         stock: 47,
//     })
//     await manager.addProduct({
//         title: "Espejo",
//         description: "Espejo luminoso",
//         price: 123,
//         thumbnail: "https://www.imagen.com",
//         code: "bawr12",
//         stock: 56,
//     })
//     await manager.addProduct({
//         title: "PS5",
//         description: "PS5 con 1000 juegos",
//         price: 5000,
//         thumbnail: "https://www.imagen.com",
//         code: "bawr13",
//         stock: 2,
//     })
//     await manager.addProduct({
//         title: "Parlante",
//         description: "Parlante de 500w",
//         price: 110,
//         thumbnail: "https://www.imagen.com",
//         code: "bawr14",
//         stock: 1,
//     })
//     await manager.addProduct({
//         title: "Teléfono",
//         description: "Teléfono huawei ultima generación"
//     })
//     await manager.addProduct({
//         title: "",
//         description: "",
//         price: 700,
//         thumbnail: "https://www.imagen.com",
//         code: "sdf123",
//         stock: 15,
//     })

//     console.log('')
//     console.log('-----------------------------')

//     console.log('')
//     console.log('--- LISTADO PRODUCTOS ---')
//     console.log('')

//     await manager.getProducts();

//     console.log('')
//     console.log('-----------------------------')

    // console.log('')
    // console.log('--- BUSQUEDA DE PRODUCTO ---')
    // console.log('')

    // await manager.getProductById(3);
    // await manager.getProductById(1);

    // console.log('')
    // console.log('-----------------------------')

    // console.log('')
    // console.log('--- ACTUALIZACIÓN DE PRODUCTO ---')
    // console.log('')
    // await manager.updateProducts(2, { title: 'Guitarra', code: 'sdf125', price: 1200 })

    // console.log('')
    // console.log('-----------------------------')

    // console.log('')
    // console.log('--- ELIMINACIÓN DE PRODUCTO ---')
    // console.log('')

    // await manager.deleteProductById(3)

    // console.log('')
    // console.log('-----------------------------')

// }

// main();
