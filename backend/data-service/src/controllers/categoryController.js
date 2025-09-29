import CategoryService from "../services/categoryService.js";
import Controller from "./controller.js";

class CategoryController extends Controller {
    async getAllCategories(req, res) {
        return this.handleRequest(req, res, CategoryService.getAllCategories);
    }

    async getCategoryById(req, res) {
        return this.handleRequest(req, res, CategoryService.getCategoryById, req.params.id);
    }

    async createCategory(req, res) {
        return this.handleRequest(req, res, CategoryService.createCategory, req.body);
    }

    async updateCategory(req, res) {
        return this.handleRequest(req, res, CategoryService.updateCategory, req.params.id, req.body);
    }

    async deleteCategory(req, res) {
        return this.handleRequest(req, res, CategoryService.deleteCategory, req.params.id);
    }
}

export default new CategoryController();