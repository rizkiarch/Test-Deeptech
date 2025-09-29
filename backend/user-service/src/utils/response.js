class Response {
    static success(data, message = 'Success', statusCode = 200) {
        return {
            status: 'success',
            message,
            data,
            statusCode
        };
    }

    static error(message = 'Error', statusCode = 500, errors = null) {
        return {
            status: 'error',
            message,
            errors,
            statusCode
        };
    }

    static notFound(message = 'Resource not found') {
        return this.error(message, 404);
    }

    static badRequest(message = 'Bad request', errors = null) {
        return this.error(message, 400, errors);
    }

    static unauthorized(message = 'Unauthorized') {
        return this.error(message, 401);
    }

    static forbidden(message = 'Forbidden') {
        return this.error(message, 403);
    }

    static noContent(message = 'No content') {
        return {
            status: 'success',
            message,
            data: null,
            statusCode: 204
        };
    }

    static internalServerError(message = 'Internal server error', errors = null) {
        return this.error(message, 500, errors);
    }

    static created(data, message = 'Resource created') {
        return this.success(data, message, 201);
    }

    static updated(data, message = 'Resource updated') {
        return this.success(data, message, 200);
    }

    static deleted(message = 'Resource deleted') {
        return this.success(null, message, 200);
    }
}

export default Response;