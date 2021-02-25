const Pool = require('pg').Pool;
const dbConfig = require('../config/db_config');
const dbQueriesTI = require('../config/queries/type_input');
const field = require('../utilities/field');
const auth = require('../utilities/auth');

// Variables
const pool = new Pool(dbConfig);


// Utilities
const newReponse = (message, typeResponse, body) => {
    return { message, typeResponse, body }
}

const dataToTI = (rows) => {
    const TIs = [];
        
    rows.forEach(element => {
        TIs.push({  
            description: element.type_input_form_des,
            id: element.type_input_form_ide,
        });
    });

    return TIs;
}


// Logic
const getTypeInput = async (req, res) => {
    const { userId } = req.params;

    if(await auth.AuthAdmin(userId)) { 
        const data = await pool.query(dbQueriesTI.getAllTypeInputs);
    
        if(data) { 
            (data.rowCount > 0)
            ? res.json(newReponse('All TIs', 'Success', dataToTI(data.rows)))
            : res.json(newReponse('Without TIs', 'Success', { }));
        
        } else {
            res.json(newReponse('Error searhing the TIs', 'Error', { }));
        }

    } else { 
        res.json(newReponse('User not admin', 'Error', { }));
    }
}

const getTypeInputById = async (req, res) => {
    const { userId, typeInputId } = req.params;
    
    if(await auth.AuthAdmin(userId)) {
        const data = await pool.query(dbQueriesTI.getTypeInputById, [ typeInputId ]);
    
        if(data) {
            (data.rows.length > 0) 
            ? res.json(newReponse('TI found', 'Success', dataToTI(data.rows)))
            : res.json(newReponse('TI not found', 'Error', { }));

        } else {
            res.json(newReponse('Error searching TI with id', 'Error', { }));
        }

    } else {
        res.json(newReponse('User not admin', 'Error', { }));
    }
}

const createTypeInput = async (req, res) => {  
    const { description, userId } = req.body;
    const errors = [];
    
    if(await auth.AuthAdmin(userId)) {
        if(!field.checkFields([ description ])) {
            errors.push({ text: 'Please fill in all the spaces' });
        }
    
        if(errors.length > 0) {
            res.json(newReponse('Errors detected', 'fail', { errors }));
        
        } else { 
            const data = await pool.query(dbQueriesTI.createTypeInput, [ description ]);
                            
            (data)
            ? res.json(newReponse('TI created', 'Success', { }))
            : res.json(newReponse('Error create TI', 'Error', { }));
        }

    } else {
        res.json(newReponse('User not admin', 'Error', { }));
    }
}

const updateTypeInputById = async (req, res) => {
    const { description } = req.body;
    const { typeInputId, userId } = req.params; 
    const errors = [];

    if(await auth.AuthAdmin(userId)) {
        if(!field.checkFields([ description ])) {
            errors.push({ text: 'Please fill in all the spaces' });
        
        } if(errors.length > 0) {
            res.json(newReponse('Errors detected', 'fail', { errors }));
        
        } else {
            const data = await pool.query(dbQueriesTI.updateTypeInputById, [ description, typeInputId ]);
                        
            (data)
            ? res.json(newReponse('TI updated', 'Success', { }))
            : res.json(newReponse('Error on update', 'Error', { }));       
        }

    } else {
        res.json(newReponse('User not admin', 'Error', { }));
    }
}

const deleteTypeInputById = async (req, res) => {
    const { typeInputId, userId } = req.params;
    
    if(await auth.AuthAdmin(userId)) { 
        const data = await pool.query(dbQueriesTI.deleteTypeInputById, [ typeInputId ]);
        
        (data)
        ? res.json(newReponse('TI deleted successfully', 'Success', { }))
        : res.json(newReponse('Error on delete with id', 'Error', { }));
    
    } else {
        res.json(newReponse('User not admin', 'Error', { }));
    }
}


// Export
module.exports = {
    getTypeInput,
    getTypeInputById,
    createTypeInput,
    updateTypeInputById,
    deleteTypeInputById
}