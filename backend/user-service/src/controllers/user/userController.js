import Controller from "../controller.js";
import UserService from "../../services/userService.js";

class UserController extends Controller {
    async getAllUsers(req, res) {
        return this.handleRequest(req, res, UserService.getAllUsers);
    }

    async getUserById(req, res) {
        return this.handleRequest(req, res, UserService.getUserById, req.params.id);
    }

    async createUser(req, res) {
        return this.handleRequest(req, res, UserService.createUser, req.body);
    }

    async updateUser(req, res) {
        return this.handleRequest(req, res, UserService.updateUser, req.params.id, req.body);
    }

    async deleteUser(req, res) {
        return this.handleRequest(req, res, UserService.deleteUser, req.params.id);
    }
}

export default new UserController();