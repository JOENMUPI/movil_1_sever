const router = require('express').Router();
const typeInput = require('../controllers/type_input_controller');

// Variables
const endPoint = '/ti';


// Get
router.get(`${ endPoint }/:userId`, typeInput.getTypeInput);
router.get(`${ endPoint }/:userId/:typeInputId`, typeInput.getTypeInputById);

// Post
router.post(endPoint, typeInput.createTypeInput);


// Put
router.put(`${ endPoint }/:userId/:typeInputId`, typeInput.updateTypeInputById);


// Delete
router.delete(`${ endPoint }/:userId/:typeInputId`, typeInput.deleteTypeInputById);


// Export
module.exports = router;