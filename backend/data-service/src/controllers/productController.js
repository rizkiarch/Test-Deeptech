import ProductService from "../services/productService.js";
import Controller from "./controller.js";
import { getFileUrl } from "../middlewares/upload.js";

class ProductController extends Controller {
    async getAllProducts(req, res) {
        return this.handleRequest(req, res, ProductService.getAllProducts, req);
    }

    async getProductById(req, res) {
        return this.handleRequest(req, res, ProductService.getProductById, req.params.id, req);
    }

    async createProduct(req, res) {
        if (req.file) {
            req.body.image = req.file.filename;
        }
        return this.handleRequest(req, res, ProductService.createProduct, req.body, req);
    }

    async updateProduct(req, res) {

        if (req.file) {
            req.body.image = req.file.filename;
        }

        if (req.body.category_id) {
            req.body.category_id = parseInt(req.body.category_id);
        }
        if (req.body.stock) {
            req.body.stock = parseInt(req.body.stock);
        }

        return this.handleRequest(req, res, ProductService.updateProduct, req.params.id, req.body, req);
    }

    async deleteProduct(req, res) {
        return this.handleRequest(req, res, ProductService.deleteProduct, req.params.id);
    }

    async getProductsByCategory(req, res) {
        return this.handleRequest(req, res, ProductService.getProductsByCategory, req.params.categoryId, req);
    }
}

export default new ProductController();