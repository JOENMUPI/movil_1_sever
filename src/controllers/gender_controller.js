const Pool = require('pg').Pool;
const dbConfig = require('../config/db_config');
const dbQueriesGender = require('../config/queries/gender');
const field = require('../utilities/field');

// Variables
const pool = new Pool(dbConfig);


// Utilities
const newReponse = (message, typeResponse, body) => {
    return { message, typeResponse, body }
}

const dataToGender = (rows) => {
    const genders = [];
        
    rows.forEach(element => {
        roles.push({  
            description: element.gender_des,
            id: element.gender_ide,
        });
    });

    return genders;
}


// Logic
const getGender = async (req, res) => {
    const data = await pool.query(dbQueriesGender.getAllGenders);
    
    (data) 
    ? res.json(newReponse('All genders', 'Success', dataToGender(data.rows)))
    : res.json(newReponse('Error searhing the gender', 'Error', { }));
}

const getGenderById = async (req, res) => {
    const data = await pool.query(dbQueriesGender.getGenderById, [ req.params.id ]);
    
    if(data) {
        (data.rows.length > 0) 
        ? res.json(newReponse('role found', 'Success', dataToGender(data.rows)))
        : res.json(newReponse('role not found', 'Error', { }));

    } else {
        res.json(newReponse('Error searching role with id', 'Error', { }));
    }
}

const createGender = (req, res) => {  
    const { description } = req.body;
    const errors = [];
    
    if(!field.checkFields([ description ])) {
        errors.push({ text: 'Please fill in all the spaces' });
    }

    if(errors.length > 0) {
        res.json(newReponse('Errors detected', 'fail', { errors }));
    
    } else { 
        const data = await pool.query(dbQueriesGender.createGender, [ description ]);
                        
        (data)
        ? res.json(newReponse('Gender created', 'Success', { }))
        : res.json(newReponse('Error create gender', 'Error', { }));
    }
}

const updateGenderById = async (req, res) => {
    const { description } = req.body;
    const { id } = req.params; 
    const errors = [];

    if(!field.checkFields([ description ])) {
        errors.push({ text: 'Please fill in all the spaces' });
    
    } if(errors.length > 0) {
        res.json(newReponse('Errors detected', 'fail', { errors }));
    
    } else {
        const data = await pool.query(dbQueriesGender.updateGenderById, [ description, id ]);
                    
        (data)
        ? res.json(newReponse('Gender updated', 'Success', { }))
        : res.json(newReponse('Error on update', 'Error', { }));       
    }
}

const deleteGenderById = async (req, res) => {
    const { id } = req.params;
    const data = await pool.query(dbQueriesGender.deleteGenderById, [ id ]);
    
    (data)
    ? res.json(newReponse('Role deleted successfully', 'Success', { }))
    : res.json(newReponse('Error on delete with id', 'Error', { }));
}


// Export
module.exports = {
    getGender, 
    createGender, 
    getGenderById,
    updateGenderById,
    deleteGenderById
}