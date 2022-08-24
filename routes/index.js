const express = require("express");
const users = require("./users.route");
const errorHandleUtil = require("../utils/error-handle-util");
const router = express.Router();

router.post("/register-investor", users.registerInvestor);
router.post("/register-startup", users.registerStartup);
router.post("/login", users.login);
router.get("/decode", users.decode);

router.use(errorHandleUtil.handleInternalApiError);

module.exports = router;
