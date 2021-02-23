const router = require('express').Router();
const form = require('../controllers/form_controller');

// Variables
const endPoint = '/form';


// Get
router.get(`${ endPoint }/:formId`, form.getFormById);

// Post
router.post(`${ endPoint }/:userId/:menuId`, form.createForm);


// Put
//router.put(`${ endPoint }/:userId/:genderId`, gender.updateGenderById);


// Delete
//router.delete(`${ endPoint }/:userId/:genderId`, gender.deleteGenderById);


// Export
module.exports = router;