import AuthService from "../../services/authService.js";
import Controller from "../controller.js";

class AuthController extends Controller {
    async login(req, res) {
        return this.handleRequest(req, res, AuthService.login, req.body);
    }

    async logout(req, res) {
        return this.handleRequest(req, res, AuthService.logout, req.user);
    }
}

export default new AuthController();