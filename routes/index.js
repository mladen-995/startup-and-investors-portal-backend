const express = require("express");
const users = require("./users.route");
const ads = require("./ads.route");
const news = require("./news.route");
const notifs = require("./notifications.route");
const discussions = require("./discussions.route");
const surveys = require("./surveys.route");
const categories = require("./categories.route");
const startupGroups = require("./startup-groups.route");
const locations = require("./locations.route");
const ciphers = require("./ciphers.route");
const userValidators = require("../utils/validators/users.validators");
const adValidators = require("../utils/validators/ads.validators");
const notifValidators = require("../utils/validators/notifications.validators");
const newsValidators = require("../utils/validators/news.validators");
const discussionsValidators = require("../utils/validators/discussions.validators");
const surveysValidators = require("../utils/validators/surveys.validators");
const categoriesValidators = require("../utils/validators/categories.validators");
const startupGroupsValidators = require("../utils/validators/startup-groups.validators");
const locationsValidators = require("../utils/validators/locations.validators");
const ciphersValidators = require("../utils/validators/ciphers.validators");
const errorHandleUtil = require("../utils/error-handle-util");
const userMiddleware = require("../middlewares/users.middleware");
const { addPagination } = require("../middlewares/search.middleware");
const router = express.Router();

router.post("/register-investor", userValidators.registerInvestor, users.registerInvestor);
router.post("/register-startup", userValidators.registerStartup, users.registerStartup);

router.get("/investors", userMiddleware.checkUser, addPagination, users.getInvestors);
router.get("/investors/:investorId", userMiddleware.checkUser, userValidators.getInvestor, users.getInvestor);

router.get("/startups", userMiddleware.checkUser, addPagination, users.getStartups);
router.get("/startups/:startupId", userMiddleware.checkUser, userValidators.getStartup, users.getStartup);

router.get("/startup-public-fields/:startupId", userMiddleware.checkUser, userValidators.getStartupPublicFields, users.getStartupPublicFields);
// check if self call
router.put("/startup-public-fields/:startupId", userMiddleware.checkUser, userValidators.updateStartupPublicFields, users.updateStartupPublicFields);

router.put("/update-investor/:userId",userMiddleware.checkUser, userValidators.updateInvestor, users.updateInvestor);
router.put("/update-startup/:userId", userMiddleware.checkUser, userValidators.updateStartup, users.updateStartup);
router.put("/update-administrator/:userId", userMiddleware.checkUser, userValidators.updateAdministrator, users.updateAdministrator);

// check if user is investor
router.post("/ads", userMiddleware.checkUser, adValidators.createAd, ads.createAd);
// check if user is admin
router.post("/ads/delete-request/:adId", userMiddleware.checkUser, adValidators.adDeleteRequest, ads.adDeleteRequest);
router.delete("/ads/:adId", userMiddleware.checkUser, adValidators.deleteAd, ads.deleteAd);
router.get("/ads", userMiddleware.addUserIdToReqIfExists, addPagination, ads.getAds);
router.get("/ads/:adId", adValidators.getAd, ads.getAd);

// check if investor or startup
router.post("/news", userMiddleware.checkUser, newsValidators.createNews, news.createNews);
router.post("/news/archive/:newsId", userMiddleware.checkUser, newsValidators.archiveNews, news.archiveNews);
router.post("/news/delete-request/:newsId", userMiddleware.checkUser, newsValidators.newsDeleteRequest, news.newsDeleteRequest);
router.delete("/news/:newsId", userMiddleware.checkUser, newsValidators.deleteNews, news.deleteNews);
router.get("/news", userMiddleware.addUserIdToReqIfExists, addPagination, news.getNews);
router.get("/news/:newsId", newsValidators.getSingleNews, news.getSingleNews);

// check if user is investor
router.post("/notifications", userMiddleware.checkUser, notifValidators.createNotif, notifs.createNotification);
// check if user is admin
router.post("/notifications/delete-request/:notificationId", userMiddleware.checkUser, notifValidators.notifDeleteRequest, notifs.notificationDeleteRequest);
router.delete("/notifications/:notificationId", userMiddleware.checkUser, notifValidators.deleteNotif, notifs.deleteNotification);
router.get("/notifications", userMiddleware.addUserIdToReqIfExists, addPagination, notifs.getNotifications);
router.get("/notifications/:notificationId", notifValidators.getNotification, notifs.getNotification);

// check if user is investor
router.post("/discussions", userMiddleware.checkUser, discussionsValidators.createDiscussion, discussions.createDiscussion);
router.post("/discussions-reply/:parentId", userMiddleware.checkUser, discussionsValidators.createDiscussionReply, discussions.createDiscussionReply);
// // check if user is admin
router.post("/discussions/delete-request/:discussionId", userMiddleware.checkUser, discussionsValidators.discussionDeleteRequest, discussions.discussionDeleteRequest);
router.delete("/discussions/:discussionId", userMiddleware.checkUser, discussionsValidators.deleteDiscussion, discussions.deleteDiscussion);
router.get("/discussions", userMiddleware.addUserIdToReqIfExists, addPagination, discussions.getDiscussions);
router.get("/discussions/:discussionId", discussionsValidators.getDiscussion, discussions.getDiscussion);
router.get("/discussions-replies/:parentId", userMiddleware.checkUser, discussionsValidators.getDiscussionReplies, discussions.getDiscussionReplies);

router.post("/surveys", userMiddleware.checkUser, surveysValidators.createSurvey, surveys.createSurvey);
router.post("/surveys/reject/:surveyId", userMiddleware.checkUser, surveysValidators.rejectSurvey, surveys.rejectSurvey);
router.get("/surveys-questions/:surveyId", userMiddleware.checkUser, surveysValidators.getSurveyQuestions, surveys.getSurveyQuestions);
router.post("/surveys/answer/:surveyId", userMiddleware.checkUser, surveysValidators.answerSurvey, surveys.answerSurvey);
router.get("/surveys", userMiddleware.checkUser, addPagination, surveys.getSurveys);
router.get("/surveys/:surveyId", surveysValidators.getSurvey, surveys.getSurvey);
router.get("/surveys/question-answers/:questionId", userMiddleware.checkUser, surveysValidators.getSurveyQuestionAnswers, surveys.getSurveyQuestionAnswers);

router.post("/categories", userMiddleware.checkUser, categoriesValidators.createCategory, categories.createCategory);
router.get("/categories", userMiddleware.checkUser, addPagination, categoriesValidators.getCategories, categories.getCategories);
router.get("/categories/:categoryId", userMiddleware.checkUser, categoriesValidators.getCategory, categories.getCategory);
router.delete("/categories/:categoryId", userMiddleware.checkUser, categoriesValidators.deleteCategory, categories.deleteCategory);

router.get("/startup-groups", userMiddleware.checkUser, addPagination, startupGroups.getStartupGroups);
router.get("/startup-groups/:groupId", userMiddleware.checkUser, startupGroupsValidators.getStartupGroup, startupGroups.getStartupGroup);
router.post("/startup-groups", userMiddleware.checkUser, startupGroupsValidators.createStartupGroup, startupGroups.createStartupGroup);
router.delete("/startup-groups/:groupId", userMiddleware.checkUser, startupGroupsValidators.deleteStartupGroup, startupGroups.deleteStartupGroup);

router.get("/countries", addPagination, locations.getCountries);
router.get("/countries/id/:countryId", userMiddleware.checkUser, locationsValidators.getCountry, locations.getCountry);
router.post("/countries", userMiddleware.checkUser, locationsValidators.createCountry, locations.createCountry);
router.delete("/countries/:countryId", userMiddleware.checkUser, locationsValidators.deleteCountry, locations.deleteCountry);

router.get("/cities/:countryId", addPagination, locationsValidators.getCities, locations.getCities);
router.get("/cities/id/:cityId", userMiddleware.checkUser, locationsValidators.getCity, locations.getCity);
router.post("/cities", userMiddleware.checkUser, locationsValidators.createCity, locations.createCity);
router.delete("/cities/:cityId", userMiddleware.checkUser, locationsValidators.deleteCity, locations.deleteCity);

router.get("/municipalities/:cityId", addPagination, locationsValidators.getMunicipalities, locations.getMunicipalities);
router.get("/municipalities/id/:municipalityId", userMiddleware.checkUser, locationsValidators.getMunicipality, locations.getMunicipality);
router.post("/municipalities", userMiddleware.checkUser, locationsValidators.createMunicipality, locations.createMunicipality);
router.delete("/municipalities/:municipalityId", userMiddleware.checkUser, locationsValidators.deleteMunicipality, locations.deleteMunicipality);

router.get("/streets/:municipalityId", addPagination, locationsValidators.getStreets, locations.getStreets);
router.get("/streets/id/:streetId", userMiddleware.checkUser, locationsValidators.getStreet, locations.getStreet);
router.post("/streets", userMiddleware.checkUser, locationsValidators.createStreet, locations.createStreet);
router.delete("/streets/:streetId", userMiddleware.checkUser, locationsValidators.deleteStreet, locations.deleteStreet);

router.get("/street-numbers/:streetId", addPagination, locationsValidators.getStreetNumbers, locations.getStreetNumbers);
router.get("/street-numbers/id/:streetNumberId", userMiddleware.checkUser, locationsValidators.getStreetNumber, locations.getStreetNumber);
router.post("/street-numbers", userMiddleware.checkUser, locationsValidators.createStreetNumber, locations.createStreetNumber);
router.delete("/street-numbers/:streetNumberId", userMiddleware.checkUser, locationsValidators.deleteStreetNumber, locations.deleteStreetNumber);

router.get("/ciphers/:cipherTypeName", addPagination, ciphersValidators.getCiphers, ciphers.getCiphers);
router.get("/ciphers/id/:cipherId", userMiddleware.checkUser, ciphersValidators.getCipher, ciphers.getCipher);
router.post("/ciphers", userMiddleware.checkUser, ciphersValidators.createCipher, ciphers.createCipher);
router.delete("/ciphers/:cipherId", userMiddleware.checkUser, ciphersValidators.deleteCipher, ciphers.deleteCipher);

router.post("/login", users.login);

router.use(errorHandleUtil.handleInternalApiError);

module.exports = router;
