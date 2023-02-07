import ProductManager from "./ProductManager.js";
const products = new ProductManager('example');

class ProductController {

    static async getProducts(req, res) {
        try {
            let response = {};
            let { limit } = req.query;
            limit = Number(limit);
            const allProducts = await products.getProducts();
            if (!isNaN(limit)) {
                response = {
                    products: allProducts.slice(0, limit),
                }
            } else {
                response = {
                    products: allProducts,
                }
            }
            return res.json(response)
        } catch (error) {
            throw error;
        }
    }

    static async getProductByID(req, res) {
        try {
            let response = {};
            let { pid } = req.params;
            pid = Number(pid);
            if (!isNaN(pid)) {
                const productById = await products.getProductById(pid);
                if (typeof productById === 'string') {
                    response = {
                        message: "El producto no existe"
                    }
                } else {
                    response = {
                        product: productById
                    }
                }
            } else {
                response = {
                    message: "El producto no existe"
                }
            }
            return res.json(response)
        } catch (error) {
            throw error;
        }

    }

}

export default ProductController;