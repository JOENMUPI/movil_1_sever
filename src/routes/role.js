const router = require('express').Router();
const role = require('../controllers/role_controller');

// Variables
const endPoint = '/role';


// Get
router.get(`${ endPoint }/:userId`, role.authUser);

// Post


// Put


// Delete


// Export
module.exports = router;