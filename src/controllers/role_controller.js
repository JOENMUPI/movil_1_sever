const Pool = require('pg').Pool;
const dbConfig = require('../config/db_config');
const dbQueriesRole = require('../config/queries/role');
const field = require('../utilities/field');

// Variables
const pool = new Pool(dbConfig);


// Utilities
const newReponse = (message, typeResponse, body) => {
    return {  message, typeResponse, body }
}

const dataToRole = (rows) => {
    const roles = [];
        
    rows.forEach(element => {
        roles.push({  
            description: element.role_des,
            id: element.role_ide,
        });
    });

    return roles;
}


// Logic
const getRole = async (req, res) => {
    const data = await pool.query(dbQueriesRole.getAllRoles);
    
    (data) 
    ? res.json(newReponse('All roles', 'Success', dataToRole(data.rows)))
    : res.json(newReponse('Error searhing the roles', 'Error', { }));
}

const getRoleById = async (req, res) => {
    const data = await pool.query(dbQueriesRole.getRoleById, [ req.params.id ]);
    
    if(data) {
        (data.rows.length > 0) 
        ? res.json(newReponse('role found', 'Success', dataToRole(data.rows)))
        : res.json(newReponse('role not found', 'Error', { }));

    } else {
        res.json(newReponse('Error searching role with id', 'Error', { }));
    }
}

const createRole = (req, res) => {  
    const { description } = req.body;
    const errors = [];
    
    if(!field.checkFields([ description ])) {
        errors.push({ text: 'Please fill in all the spaces' });
    }

    if(errors.length > 0) {
        res.json(newReponse('Errors detected', 'fail', { errors }));
    
    } else { 
        const data = await pool.query(dbQueriesRole.createRole, [ description ]);
                        
        (data)
        ? res.json(newReponse('Role created', 'Success', { }))
        : res.json(newReponse('Error create role', 'Error', { }));
    }
}

const updateRoleById = async (req, res) => {
    const { description } = req.body;
    const { id } = req.params; 
    const errors = [];

    if(!field.checkFields([ description ])) {
        errors.push({ text: 'Please fill in all the spaces' });
    
    } if(errors.length > 0) {
        res.json(newReponse('Errors detected', 'fail', { errors }));
    
    } else {
        const data = await pool.query(dbQueriesRole.updateRoleById, [ description, id ]);
                    
        (data)
        ? res.json(newReponse('Role updated', 'Success', { }))
        : res.json(newReponse('Error on update', 'Error', { }));       
    }
}

const deleteRoleById = async (req, res) => {
    const { id } = req.params;
    const data = await pool.query(dbQueriesRole.deleteRoleById, [ id ]);
    
    (data)
    ? res.json(newReponse('Role deleted successfully', 'Success', { }))
    : res.json(newReponse('Error on delete with id', 'Error', { }));
}


// Export
module.exports = {
    getRole, 
    createRole, 
    getRoleById,
    updateRoleById,
    deleteRoleById
}