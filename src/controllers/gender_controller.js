const Pool = require('pg').Pool;
const dbConfig = require('../config/db_config');
const dbQueriesGender = require('../config/queries/gender');
const field = require('../utilities/field');
const auth = require('../utilities/auth');

// Variables
const pool = new Pool(dbConfig);


// Utilities
const newReponse = (message, typeResponse, body) => {
    return { message, typeResponse, body }
}

const dataToGender = (rows) => {
    const genders = [];
        
    rows.forEach(element => {
        genders.push({  
            description: element.gender_des,
            id: element.gender_ide,
        });
    });

    return genders;
}


// Logic
const getGender = async (req, res) => {
    const { userId } = req.params;

    if(await auth.AuthAdmin(userId)) { 
        const data = await pool.query(dbQueriesGender.getAllGenders);
    
        if(data) {
            (data.rows.length > 0)
            ? res.json(newReponse('All genders', 'Success', dataToGender(data.rows)))
            : res.json(newReponse('Error searhing the gender', 'Error', { }));
        
        } else {
            res.json(newReponse('Without genders', 'Success', { }));
        }

    } else { 
        res.json(newReponse('User not admin', 'Error', { }));
    }
}

const getGenderById = async (req, res) => {
    const { userId, genderId } = req.params;
    
    if(await auth.AuthAdmin(userId)) {
        const data = await pool.query(dbQueriesGender.getGenderById, [ genderId ]);
    
        if(data) {
            (data.rows.length > 0) 
            ? res.json(newReponse('role found', 'Success', dataToGender(data.rows)))
            : res.json(newReponse('role not found', 'Error', { }));

        } else {
            res.json(newReponse('Error searching role with id', 'Error', { }));
        }

    } else {
        res.json(newReponse('User not admin', 'Error', { }));
    }
}

const createGender = async (req, res) => {  
    const { description } = req.body;
    const { userId } = req.params;
    const errors = [];
    
    if(await auth.AuthAdmin(userId)) {
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

    } else {
        res.json(newReponse('User not admin', 'Error', { }));
    }
}

const updateGenderById = async (req, res) => {
    const { description } = req.body;
    const { genderId, userId } = req.params; 
    const errors = [];

    if(await auth.AuthAdmin(userId)) {
        if(!field.checkFields([ description ])) {
            errors.push({ text: 'Please fill in all the spaces' });
        
        } if(errors.length > 0) {
            res.json(newReponse('Errors detected', 'fail', { errors }));
        
        } else {
            const data = await pool.query(dbQueriesGender.updateGenderById, [ description, genderId ]);
                        
            (data)
            ? res.json(newReponse('Gender updated', 'Success', { }))
            : res.json(newReponse('Error on update', 'Error', { }));       
        }

    } else {
        res.json(newReponse('User not admin', 'Error', { }));
    }
}

const deleteGenderById = async (req, res) => {
    const { genderId, userId } = req.params;
    const data = await pool.query(dbQueriesGender.deleteGenderById, [ genderId ]);
    
    if(await auth.AuthAdmin(userId)) {
        (data)
        ? res.json(newReponse('Gender deleted successfully', 'Success', { }))
        : res.json(newReponse('Error on delete with id', 'Error', { }));
    
    } else {
        res.json(newReponse('User not admin', 'Error', { }));
    }
}


// Export
module.exports = {
    getGender, 
    createGender, 
    getGenderById,
    updateGenderById,
    deleteGenderById
}