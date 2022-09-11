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
const errorHandleUtil = require("../middlewares/error-handler.middleware");
const userMiddleware = require("../middlewares/users.middleware");
const { addPagination } = require("../middlewares/search.middleware");
const router = express.Router();

router.post("/register-investor", userValidators.registerInvestor, users.registerInvestor);
router.post("/register-startup", userValidators.registerStartup, users.registerStartup);

router.post("/password-change", userMiddleware.checkUser, userValidators.changePassword, users.changePassword);
router.post("/password-reset", userValidators.requestPasswordReset, users.requestPasswordReset);
router.post("/password-reset/:token", userValidators.resetPassword, users.resetPassword);

router.get("/user-creation-requests", userMiddleware.checkUser, userMiddleware.checkIfAdministrator, users.getUserCreationRequests);
router.post("/user-creation-requests/approve/:requestId", userMiddleware.checkUser, userMiddleware.checkIfAdministrator, userValidators.approveUserCreationRequest, users.approveUserCreationRequest);
router.post("/user-creation-requests/reject/:requestId", userMiddleware.checkUser, userMiddleware.checkIfAdministrator, userValidators.approveUserCreationRequest, users.rejectUserCreationRequest);

router.post("/investor-search-requests", userMiddleware.checkUser, userMiddleware.checkIfInvestor, users.createInvestorSearchRequest);
router.get("/investor-search-requests", userMiddleware.checkUser, userMiddleware.checkIfAdministrator, users.getInvestorSearchRequests);
router.post("/investor-search-requests/approve/:requestId", userMiddleware.checkUser, userMiddleware.checkIfAdministrator, userValidators.approveInvestorSearchRequest, users.approveInvestorSearchRequest);
router.post("/investor-search-requests/reject/:requestId", userMiddleware.checkUser, userMiddleware.checkIfAdministrator, userValidators.approveInvestorSearchRequest, users.rejectInvestorSearchRequest);

router.get("/investors", userMiddleware.checkUser, addPagination, users.getInvestors);
router.get("/investors/:investorId", userMiddleware.checkUser, userValidators.getInvestor, users.getInvestor); // mozda svi da mogu da vide
router.get("/investor/can-search-startups", userMiddleware.checkUser, userMiddleware.checkIfInvestor, users.getInvestorCanSearchStartups);

router.get("/muted-investors", userMiddleware.checkUser, userMiddleware.checkIfInvestorOrStartup, users.getInvestorMutePairs);
router.post("/mute-investor/:investorId", userMiddleware.checkUser, userMiddleware.checkIfInvestorOrStartup, userValidators.muteInvestor, users.muteInvestor);
router.post("/unmute-investor/:investorId", userMiddleware.checkUser, userMiddleware.checkIfInvestorOrStartup, userValidators.unmuteInvestor, users.unmuteInvestor);

router.get("/startups", userMiddleware.checkUser, addPagination, users.getStartups);
router.get("/startups/:startupId", userMiddleware.checkUser, userValidators.getStartup, users.getStartup);// mozda svi da mogu da vide

router.get("/startup-public-fields/:startupId", userMiddleware.checkUser, userValidators.getStartupPublicFields, users.getStartupPublicFields);
// check if self call
router.put("/startup-public-fields/:startupId", userMiddleware.checkUser, userValidators.updateStartupPublicFields, users.updateStartupPublicFields);

router.put("/update-investor/:userId",userMiddleware.checkUser, userValidators.updateInvestor, users.updateInvestor);
router.put("/update-startup/:userId", userMiddleware.checkUser, userValidators.updateStartup, users.updateStartup);
router.put("/update-administrator/:userId", userMiddleware.checkUser, userValidators.updateAdministrator, users.updateAdministrator);

router.post("/ads", userMiddleware.checkUser, userMiddleware.checkIfInvestor, adValidators.createAd, ads.createAd);
// check if user is admin
router.post("/ads/delete-request/:adId", userMiddleware.checkUser, adValidators.adDeleteRequest, ads.adDeleteRequest);
router.delete("/ads/:adId", userMiddleware.checkUser, userMiddleware.checkIfAdministrator, adValidators.deleteAd, ads.deleteAd);
router.post("/ads/decline-delete-request/:adId", userMiddleware.checkUser, userMiddleware.checkIfAdministrator, adValidators.deleteAd, ads.declineAdDeleteRequest);
router.get("/ads", userMiddleware.addUserIdToReqIfExists, addPagination, ads.getAds);
router.get("/ads/:adId", adValidators.getAd, ads.getAd);

// check if investor or startup
router.post("/news", userMiddleware.checkUser, userMiddleware.checkIfInvestorOrStartup, newsValidators.createNews, news.createNews);
router.post("/news/archive/:newsId", userMiddleware.checkUser, userMiddleware.checkIfInvestorOrStartup, newsValidators.archiveNews, news.archiveNews);
router.post("/news/delete-request/:newsId", userMiddleware.checkUser, userMiddleware.checkIfInvestorOrStartup, newsValidators.newsDeleteRequest, news.newsDeleteRequest);
router.delete("/news/:newsId", userMiddleware.checkUser, userMiddleware.checkIfAdministrator, newsValidators.deleteNews, news.deleteNews);
router.post("/news/decline-delete-request/:newsId", userMiddleware.checkUser, userMiddleware.checkIfAdministrator, newsValidators.deleteNews, news.declineNewsDeleteRequest);
router.get("/news", userMiddleware.addUserIdToReqIfExists, addPagination, news.getNews);
router.get("/news/:newsId", newsValidators.getSingleNews, news.getSingleNews);

// check if user is investor
router.post("/notifications", userMiddleware.checkUser, userMiddleware.checkIfInvestor, notifValidators.createNotif, notifs.createNotification);
// check if user is admin
router.post("/notifications/delete-request/:notificationId", userMiddleware.checkUser, userMiddleware.checkIfInvestor, notifValidators.notifDeleteRequest, notifs.notificationDeleteRequest);
router.delete("/notifications/:notificationId", userMiddleware.checkUser, userMiddleware.checkIfAdministrator, notifValidators.deleteNotif, notifs.deleteNotification);
router.post("/notifications/archive/:notificationId", userMiddleware.checkUser, userMiddleware.checkIfInvestor, notifValidators.deleteNotif, notifs.archiveNotification);
router.post("/notifications/decline-delete-request/:notificationId", userMiddleware.checkUser, userMiddleware.checkIfAdministrator, notifValidators.deleteNotif, notifs.declineNotificationDeleteRequest);
router.get("/notifications", userMiddleware.addUserIdToReqIfExists, addPagination, notifs.getNotifications);
router.get("/notifications/:notificationId", notifValidators.getNotification, notifs.getNotification);

router.post("/discussions", userMiddleware.checkUser, userMiddleware.checkIfInvestorOrStartup, discussionsValidators.createDiscussion, discussions.createDiscussion);
router.post("/discussions-reply/:parentId", userMiddleware.checkUser, userMiddleware.checkIfInvestorOrStartup, discussionsValidators.createDiscussionReply, discussions.createDiscussionReply);
router.post("/discussions/delete-request/:discussionId", userMiddleware.checkUser, userMiddleware.checkIfInvestorOrStartup, discussionsValidators.discussionDeleteRequest, discussions.discussionDeleteRequest);
router.delete("/discussions/:discussionId", userMiddleware.checkUser, userMiddleware.checkIfAdministrator, discussionsValidators.deleteDiscussion, discussions.deleteDiscussion);
router.post("/discussions/decline-delete-request/:discussionId", userMiddleware.checkUser, userMiddleware.checkIfAdministrator, discussionsValidators.deleteDiscussion, discussions.declineDiscussionDeleteRequest);
router.get("/discussions", userMiddleware.addUserIdToReqIfExists, addPagination, discussions.getDiscussions);
router.get("/discussions/:discussionId", discussionsValidators.getDiscussion, discussions.getDiscussion);
router.post("/discussions/archive/:discussionId", userMiddleware.checkUser, userMiddleware.checkIfInvestorOrStartup, discussionsValidators.deleteDiscussion, discussions.archiveDiscussion);
router.get("/discussions-replies/:parentId", userMiddleware.checkUser, discussionsValidators.getDiscussionReplies, discussions.getDiscussionReplies);

router.post("/surveys", userMiddleware.checkUser, userMiddleware.checkIfInvestor,surveysValidators.createSurvey, surveys.createSurvey);
router.post("/surveys/reject/:surveyId", userMiddleware.checkUser, userMiddleware.checkIfStartup, surveysValidators.rejectSurvey, surveys.rejectSurvey);
router.get("/surveys-questions/:surveyId", userMiddleware.checkUser, surveysValidators.getSurveyQuestions, surveys.getSurveyQuestions);
router.post("/surveys/answer/:surveyId", userMiddleware.checkUser, userMiddleware.checkIfStartup, surveysValidators.answerSurvey, surveys.answerSurvey);
router.get("/surveys", userMiddleware.checkUser, addPagination, surveys.getSurveys);
router.get("/surveys/:surveyId", surveysValidators.getSurvey, surveys.getSurvey);
router.get("/surveys/question-answers/:questionId", userMiddleware.checkUser, surveysValidators.getSurveyQuestionAnswers, surveys.getSurveyQuestionAnswers);
router.delete("/surveys/:surveyId", userMiddleware.checkUser, userMiddleware.checkIfAdministrator, surveysValidators.deleteSurvey, surveys.deleteSurvey);

router.post("/categories", userMiddleware.checkUser, categoriesValidators.createCategory, categories.createCategory);
router.get("/categories", addPagination, categoriesValidators.getCategories, categories.getCategories);
router.get("/categories/:categoryId", categoriesValidators.getCategory, categories.getCategory);
router.delete("/categories/:categoryId", userMiddleware.checkUser, categoriesValidators.deleteCategory, categories.deleteCategory);

router.get("/startup-groups", userMiddleware.checkUser, addPagination, startupGroups.getStartupGroups);
router.get("/startup-groups-for-user", userMiddleware.checkUser, addPagination, startupGroups.getStartupGroupsForUser);
router.get("/startup-groups/:groupId", userMiddleware.checkUser, startupGroupsValidators.getStartupGroup, startupGroups.getStartupGroup);
router.post("/startup-groups", userMiddleware.checkUser, startupGroupsValidators.createStartupGroup, startupGroups.createStartupGroup);
router.post("/startup-groups/join/:groupId", userMiddleware.checkUser, startupGroupsValidators.joinStartupGroup, startupGroups.joinStartupGroup);
router.post("/startup-groups/leave/:groupId", userMiddleware.checkUser, startupGroupsValidators.leaveStartupGroup, startupGroups.leaveStartupGroup);
router.delete("/startup-groups/:groupId", userMiddleware.checkUser, userMiddleware.checkIfAdministrator, startupGroupsValidators.deleteStartupGroup, startupGroups.deleteStartupGroup);

router.get("/countries", addPagination, locations.getCountries);
router.get("/countries/id/:countryId", locationsValidators.getCountry, locations.getCountry);
router.post("/countries", userMiddleware.checkUser, userMiddleware.checkIfAdministrator, locationsValidators.createCountry, locations.createCountry);
router.delete("/countries/:countryId", userMiddleware.checkUser, userMiddleware.checkIfAdministrator, locationsValidators.deleteCountry, locations.deleteCountry);

router.get("/cities", addPagination, locations.getAllCities);
router.get("/cities/:countryId", addPagination, locationsValidators.getCities, locations.getCities);
router.get("/cities/id/:cityId", locationsValidators.getCity, locations.getCity);
router.post("/cities", userMiddleware.checkUser, userMiddleware.checkIfAdministrator, locationsValidators.createCity, locations.createCity);
router.delete("/cities/:cityId", userMiddleware.checkUser, userMiddleware.checkIfAdministrator, locationsValidators.deleteCity, locations.deleteCity);

router.get("/municipalities", addPagination, locations.getAllMunicipalities);
router.get("/municipalities/:cityId", addPagination, locationsValidators.getMunicipalities, locations.getMunicipalities);
router.get("/municipalities/id/:municipalityId", userMiddleware.checkUser, locationsValidators.getMunicipality, locations.getMunicipality);
router.post("/municipalities", userMiddleware.checkUser, locationsValidators.createMunicipality, locations.createMunicipality);
router.delete("/municipalities/:municipalityId", userMiddleware.checkUser, locationsValidators.deleteMunicipality, locations.deleteMunicipality);

router.get("/streets", addPagination, locations.getAllStreets);
router.get("/streets/:municipalityId", addPagination, locationsValidators.getStreets, locations.getStreets);
router.get("/streets/id/:streetId", locationsValidators.getStreet, locations.getStreet);
router.post("/streets", userMiddleware.checkUser, userMiddleware.checkIfAdministrator, locationsValidators.createStreet, locations.createStreet);
router.delete("/streets/:streetId", userMiddleware.checkUser, userMiddleware.checkIfAdministrator, locationsValidators.deleteStreet, locations.deleteStreet);

router.get("/street-numbers", addPagination, locations.getAllStreetNumbers);
router.get("/street-numbers/:streetId", addPagination, locationsValidators.getStreetNumbers, locations.getStreetNumbers);
router.get("/street-numbers/id/:streetNumberId", locationsValidators.getStreetNumber, locations.getStreetNumber);
router.post("/street-numbers", userMiddleware.checkUser, userMiddleware.checkIfAdministrator, locationsValidators.createStreetNumber, locations.createStreetNumber);
router.delete("/street-numbers/:streetNumberId", userMiddleware.checkUser, userMiddleware.checkIfAdministrator, locationsValidators.deleteStreetNumber, locations.deleteStreetNumber);

router.get("/ciphers/:cipherTypeName", addPagination, ciphersValidators.getCiphers, ciphers.getCiphers);
router.get("/ciphers/id/:cipherId", ciphersValidators.getCipher, ciphers.getCipher);
router.post("/ciphers", userMiddleware.checkUser, ciphersValidators.createCipher, ciphers.createCipher);
router.delete("/ciphers/:cipherId", userMiddleware.checkUser, userMiddleware.checkIfAdministrator, ciphersValidators.deleteCipher, ciphers.deleteCipher);

router.get("/statistics", userMiddleware.checkUser, userMiddleware.checkIfAdministrator, userValidators.getStatistics, users.getStatistics);

router.post("/login", users.login);

router.use(errorHandleUtil.handleInternalApiError);

module.exports = router;
