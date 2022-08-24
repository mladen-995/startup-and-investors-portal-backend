class ApplicationError extends Error {
    constructor(message, errorCode = 500){
        super();
        this.message = message;
        this.errorCode = errorCode;
    }

    toJSON() {
        return {
            msg: this.message,
            errorCode: this.errorCode
        };
    }

    getOutputForLogging() {
        const output = {
            errorMessage: this.message,
            stack: this.stack,
            errorCode: this.errorCode,
        };
        if (this.userId) {
            output.user_id = this.userId;
        }
        return output;
    }
}

module.exports = {
    ApplicationError,
};
