import Response from '../utils/response.js';

class Controller {
    async handleRequest(req, res, serviceMethod, ...args) {
        try {
            const result = await serviceMethod(...args);
            return res.status(result.statusCode || 200).json(Response.success(result.data, result.message));
        } catch (error) {
            const statusCode = error.statusCode || 500;
            return res.status(statusCode).json(Response.error(error.message, statusCode));
        }
    }
}

export default Controller;