const express = require("express");
const users = require("./users.route");
const ads = require("./ads.route");
const news = require("./news.route");
const notifs = require("./notifications.route");
const userValidators = require("../utils/validators/users.validators");
const adValidators = require("../utils/validators/ads.validators");
const notifValidators = require("../utils/validators/notifications.validators");
const newsValidators = require("../utils/validators/news.validators");
const errorHandleUtil = require("../utils/error-handle-util");
const userMiddleware = require("../middlewares/users.middleware");
const router = express.Router();

router.post("/register-investor", userValidators.registerInvestor, users.registerInvestor);
router.post("/register-startup", userValidators.registerStartup, users.registerStartup);
router.put("/update-investor/:userId",userMiddleware.checkUser, userValidators.updateInvestor, users.updateInvestor);
router.put("/update-startup/:userId", userMiddleware.checkUser, userValidators.updateStartup, users.updateStartup);
router.put("/update-administrator/:userId", userMiddleware.checkUser, userValidators.updateAdministrator, users.updateAdministrator);
// check if user is investor
router.post("/ads", userMiddleware.checkUser, adValidators.createAd, ads.createAd);
// check if user is admin
router.post("/ads/delete-request/:adId", userMiddleware.checkUser, adValidators.adDeleteRequest, ads.adDeleteRequest);
router.delete("/ads/:adId", userMiddleware.checkUser, adValidators.deleteAd, ads.deleteAd);
router.get("/ads", userMiddleware.addUserIdToReqIfExists, ads.getAds);
// check if investor or startup
router.post("/news", userMiddleware.checkUser, newsValidators.createNews, news.createNews);
router.post("/news/archive/:newsId", userMiddleware.checkUser, newsValidators.archiveNews, news.archiveNews);
router.post("/news/delete-request/:newsId", userMiddleware.checkUser, newsValidators.newsDeleteRequest, news.newsDeleteRequest);
router.delete("/news/:newsId", userMiddleware.checkUser, newsValidators.deleteNews, news.deleteNews);
router.get("/news", userMiddleware.addUserIdToReqIfExists, news.getNews);
router.get("/news-for-author", userMiddleware.checkUser, news.getNewsForAuthor);
// check if user is investor
router.post("/notifications", userMiddleware.checkUser, notifValidators.createNotif, notifs.createNotification);
// check if user is admin
router.post("/notifications/delete-request/:notificationId", userMiddleware.checkUser, notifValidators.notifDeleteRequest, notifs.notificationDeleteRequest);
router.delete("/notifications/:notificationId", userMiddleware.checkUser, notifValidators.deleteNotif, notifs.deleteNotification);
router.get("/notifications", userMiddleware.addUserIdToReqIfExists, notifs.getNotifications);
router.post("/login", users.login);

router.use(errorHandleUtil.handleInternalApiError);

module.exports = router;
