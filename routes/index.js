const express = require("express");
const users = require("./users.route");
const userVal = require("../utils/validators/users.validators");
const errorHandleUtil = require("../utils/error-handle-util");
const router = express.Router();

router.post("/register-investor", userVal.registerInvestor, users.registerInvestor);
router.post("/register-startup", userVal.registerStartup, users.registerStartup);
router.post("/login", users.login);
router.get("/decode", users.decode);

router.use(errorHandleUtil.handleInternalApiError);

module.exports = router;
