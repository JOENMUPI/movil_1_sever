const router = require('express').Router();
const response = require('../controllers/response_controller');

// Variables
const endPoint = '/response';


// Get
router.get(`${ endPoint }/:userId/:formId`, response.getDataByFormId);

// Post
router.post(endPoint, response.createResponses);


// Put
//router.put(`${ endPoint }/:userId/:genderId`, gender.updateGenderById);


// Delete
//router.delete(`${ endPoint }/:userId/:genderId`, gender.deleteGenderById);


// Export
module.exports = router;