const Pool = require('pg').Pool;
const dbConfig = require('../config/db_config');

// Variables
const pool = new Pool(dbConfig);


// Utilities
const newReponse = (message, typeResponse, body) => {
    return {  message, typeResponse, body }
}

const dataTo = (rows) => {
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



// Export
module.exports = {
 
}