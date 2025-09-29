class Response {
    static success(data = null, message = 'Success', statusCode = 200) {
        return {
            status: 'success',
            data,
            message,
            statusCode
        };
    }

    static error(message = 'Internal Server Error', statusCode = 500, errors = null) {
        return {
            status: 'error',
            message,
            errors,
            statusCode
        };
    }

    static paginated(data, pagination, message = 'Data retrieved successfully') {
        return {
            status: 'success',
            data,
            pagination,
            message
        };
    }
}

export default Response;