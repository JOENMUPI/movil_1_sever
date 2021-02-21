const Pool = require('pg').Pool;
const dbConfig = require('../config/db_config');
const dbQueriesRole = require('../config/queries/role');


//variables
const pool = new Pool(dbConfig);


// Logic
const AuthAdmin = async (id) => {
    const data = await pool.query(dbQueriesRole.getRoleById, [ id ]);
    
    if(data) {
        if(data.rows[0].role_des == 'Admin') {
            return true;
        
        } else {
            return false;
        }

    } else {
        return false;
    }
}


// Export
module.exports = {
    AuthAdmin
}