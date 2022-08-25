const usersService = require("../services/users.service")
const { ApplicationError } = require("../utils/errors")

function checkUser(req, res, next) {    
    try {
        const token = req.headers.authorization;
        if (!token) {
            throw new ApplicationError("Auth token not provided!", 401);
        }
        const decodedToken = usersService.decodeUserJWTToken(token);
        req.userId = decodedToken.userId;
        next();
    } catch (err) {
        next(err);
    }
}

module.exports = {
    checkUser
};
