const express = require("express");
const users = require("./users.route");
const userValidators = require("../utils/validators/users.validators");
const errorHandleUtil = require("../utils/error-handle-util");
const userMiddleware = require("../middlewares/users.middleware");
const router = express.Router();

router.post("/register-investor", userValidators.registerInvestor, users.registerInvestor);
router.post("/register-startup", userValidators.registerStartup, users.registerStartup);
router.put("/update-investor/:userId",userMiddleware.checkUser, userValidators.updateInvestor, users.updateInvestor);
router.put("/update-startup/:userId", userMiddleware.checkUser, userValidators.updateStartup, users.updateStartup);
router.put("/update-administrator/:userId", userMiddleware.checkUser, userValidators.updateAdministrator, users.updateAdministrator);
router.post("/login", users.login);

router.use(errorHandleUtil.handleInternalApiError);

module.exports = router;
