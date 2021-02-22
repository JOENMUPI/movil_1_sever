const router = require('express').Router();
const gender = require('../controllers/gender_controller');

// Variables
const endPoint = '/gender';


// Get
router.get(`${ endPoint }/:userId`, gender.getGender);
router.get(`${ endPoint }/:userId/:genderId`, gender.getGenderById);

// Post
router.post(`${ endPoint }/:userId`, gender.createGender);


// Put
router.put(`${ endPoint }/:userId/:genderId`, gender.updateGenderById);


// Delete
router.delete(`${ endPoint }/:userId/:genderId`, gender.deleteGenderById);


// Export
module.exports = router;