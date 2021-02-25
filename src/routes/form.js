const router = require('express').Router();
const form = require('../controllers/form_controller');

// Variables
const endPoint = '/form';


// Get
router.get(`${ endPoint }/:formId`, form.getFormById);
router.get(`${ endPoint }/question/:questionId`, form.getQuestionById);
router.get(`${ endPoint }/section/:sectionId`, form.getSectionById);

// Post
router.post(endPoint, form.createForm);


// Put
//router.put(`${ endPoint }/:userId/:genderId`, gender.updateGenderById);


// Delete
router.delete(`${ endPoint }/:userId/:formId`, form.deleteFormById);


// Export
module.exports = router;