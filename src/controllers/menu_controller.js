const Pool = require('pg').Pool;
const dbConfig = require('../config/db_config');
const dbQueriesMenu = require('../config/queries/menu');
const field = require('../utilities/field');
const auth = require('../utilities/auth');

// Variables
const pool = new Pool(dbConfig);


// Utilities
const newReponse = (message, typeResponse, body) => {
    return {  message, typeResponse, body }
}

const dataToMenu = (rows) => {
    const menus = [];
        
    rows.forEach(element => {
        menus.push({  
            tittle: element.sub_menu_tit,
            id: element.sub_menu_ide,
            parent: element.parent_sub_menu_ide
        });
    });

    return menus;
}


// Logic
const getMenu = async (req, res) => {
    const { userId } = req.params;

    if(await auth.AuthAdmin(userId)) { 
        const data = await pool.query(dbQueriesMenu.getAllMenus);
    
        if(data) {
            (data.rows.length > 0)
            ? res.json(newReponse('All menus', 'Success', dataToMenu(data.rows)))
            : res.json(newReponse('Error searhing the menu', 'Error', { }));
        
        } else {
            res.json(newReponse('Without menus', 'Success', { }));
        }

    } else { 
        res.json(newReponse('User not admin', 'Error', { }));
    }
}

const getMenuById = async (req, res) => {
    const { userId,  menuId } = req.params;

    if(await auth.AuthAdmin(userId)) {
        const data = await pool.query(dbQueriesMenu.getMenuById, [ menuId ]);    

        if(data) {  
            (data.rows.length > 0) 
            ? res.json(newReponse('Menu found', 'Success', dataToMenu(data.rows)))
            : res.json(newReponse('Menu not found', 'Error', { }));
    
        } else {
            res.json(newReponse('Error searching menu with id', 'Error', { }));
        }

    } else {
        res.json(newReponse('User not admin', 'Error', { }));
    }
}

const getMenuByIdWithRec = async (req, res) => {
    const { userId,  menuId } = req.params;

    if(await auth.AuthAdmin(userId)) {
        const data = await pool.query(dbQueriesMenu.getMenuByIdWithRec, [ menuId ]);    

        if(data) {  
            (data.rows.length > 0) 
            ? res.json(newReponse('Menu found', 'Success', dataToMenu(data.rows)))
            : res.json(newReponse('Menu not found', 'Error', { }));
    
        } else {
            res.json(newReponse('Error searching menu with id', 'Error', { }));
        }

    } else {
        res.json(newReponse('User not admin', 'Error', { }));
    }
}

const createMenu = async (req, res) => {  
    const { tittle, parent } = req.body;
    const { userId } = req.params;
    const errors = [];
    
    if(await auth.AuthAdmin(userId)) {
        if(!field.checkFields([ tittle ])) {
            errors.push({ text: 'Please write a tittle' });
        }
    
        if(errors.length > 0) {
            res.json(newReponse('Errors detected', 'fail', { errors }));
        
        } else { 
            const data = await pool.query(dbQueriesMenu.createMenu, [ tittle, new Date(), parent, userId ]);
                            
            (data)
            ? res.json(newReponse('Menu created', 'Success', { }))
            : res.json(newReponse('Error create menu', 'Error', { }));
        }

    } else {
        res.json(newReponse('User not admin', 'Error', { }));
    }
}

const updateMenuById = async (req, res) => {
    const { tittle, parent } = req.body;
    const { menuId, userId } = req.params; 
    const errors = [];

    if(await auth.AuthAdmin(userId)) {
        if(!field.checkFields([ tittle ])) {
            errors.push({ text: 'Please write a tittle' });
        
        } if(errors.length > 0) {
            res.json(newReponse('Errors detected', 'fail', { errors }));
        
        } else {
            const data = await pool.query(dbQueriesMenu.updateMenuById, [ tittle, parent, menuId ]);
                        
            (data)
            ? res.json(newReponse('menu updated', 'Success', { }))
            : res.json(newReponse('Error on update', 'Error', { }));       
        }

    } else {
        res.json(newReponse('User not admin', 'Error', { }));
    }
}

const deleteMenuById = async (req, res) => {
    const { menuId, userId } = req.params;
    const data = await pool.query(dbQueriesMenu.deleteMenuById, [ menuId ]);
    
    if(await auth.AuthAdmin(userId)) {
        (data)
        ? res.json(newReponse('Menu deleted successfully', 'Success', { }))
        : res.json(newReponse('Error on delete with id', 'Error', { }));
    } else {
        res.json(newReponse('User not admin', 'Error', { }));
    }
}


// Export
module.exports = {
    getMenuById,
    getMenu,
    getMenuByIdWithRec,
    createMenu,
    updateMenuById,
    deleteMenuById
}