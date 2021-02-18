const router = require('express').Router();
const user = require('../controllers/user_controller');

// Variables
const endPoint = '/user';

// Get
router.get(endPoint, user.getUser);
router.get(`${ endPoint }/:id`, user.getUserById);


// Post
router.post(`${ endPoint }/singup`, user.createUsers);
router.post(`${ endPoint }/login`, user.login);


// Put
router.put(`${ endPoint }/:id`, user.updateUserById);
router.put(`${ endPoint }/pass/:id`, user.updatePassById);


// Delete
router.delete(`${ endPoint }/:id`, user.deleteUserById);


// Export
module.exports = router;