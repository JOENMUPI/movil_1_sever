const router = require('express').Router();
const menu = require('../controllers/menu_controller');

// Variables
const endPoint = '/menu';


// Get
router.get(`${ endPoint }/:userId`, menu.getMenu);
router.get(`${ endPoint }/:userId/:menuId`, menu.getMenuById);
router.get(`${ endPoint }/rec/:menuId`, menu.getMenuByIdWithRec);


// Post
router.post(endPoint, menu.createMenu);


// Put
router.put(`${ endPoint }/:userId/:menuId`, menu.updateMenuById);


// Delete
router.delete(`${ endPoint }/:userId/:menuId`, menu.deleteMenuById);


// Export
module.exports = router;