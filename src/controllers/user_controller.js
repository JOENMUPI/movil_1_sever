const Pool = require('pg').Pool;
const bcryt = require('bcryptjs');
const dbConfig = require('../config/db_config');
const dbQueriesUser = require('../config/queries/user');
const dbQueriesGender = require('../config/queries/gender');
const passwordUtil = require('../utilities/password');
const field = require('../utilities/field');

// Variables
const pool = new Pool(dbConfig);


// Utilities
const newReponse = (message, typeResponse, body) => {
    return {  message, typeResponse, body }
}

const dataToUser = (rows) => {
    const users = [];
        
    rows.forEach(element => {
        users.push({  
            name: element.user_nam,
            email: element.user_ema,
            age: element.user_age,
            id: element.user_ide,
            gender: element.gender_des,
        });
    });

    return users;
}

const checkEmail = async (email, callBack) => {
    const data = await pool.query(dbQueriesUser.getUserByEmail, [ email ]);
    
    if(data) {
        if(data.rows.length > 0) {
            return callBack(null, dataToUser(data.rows));
        
        } else {
            return callBack(null, null);
        }    

    } else {
        return callBack('Error on query');
    }
}


// Logic
const login = async (req, res) => { 
    const { email, password } = req.body; console.log('body:', req.body); 
    const data = await pool.query(dbQueriesUser.getUserByEmail, [ email ]);
    
    if(data) { 
        if(data.rowCount > 0) { 
            const users = dataToUser(data.rows);
            
            (await bcryt.compare(password, data.rows[0].user_pas)) 
            ? res.json(newReponse('Logged successfully', 'Success', users))
            : res.json(newReponse('Incorrect password', 'Error', { }));
        
        } else {
            res.json(newReponse('Email not found', 'Error', { })); 
        }

    } else {
        res.json(newReponse('Error searching user with email', 'Error', { }));
    }
}

const getUser = async (req, res) => {
    const data = await pool.query(dbQueriesUser.getAllUsers);
    
    if (data) {
        (data.rowCount > 0)
        ? res.json(newReponse('All users', 'Success', dataToUser(data.rows)))
        : res.json(newReponse('Error searhing the users', 'Error', { }));
    
    } else { 
        res.json(newReponse('Without users', 'Success', { }));
    }
    
}

const getUserById = async (req, res) => { 
    const data = await pool.query(dbQueriesUser.getUserById, [ req.params.id ]);
    
    if(data) {
        (data.rowCount > 0) 
        ? res.json(newReponse('User found', 'Success', dataToUser(data.rows)))
        : res.json(newReponse('User not found', 'Error', { }));

    } else {
        res.json(newReponse('Error searching user with id', 'Error', { }));
    }
}

const createUsers = (req, res) => {  
    const { name, password, gender, age, confirmPassword, email } = req.body;
    const errors = [];
    
    if(!field.checkFields([ age, gender, name, password, confirmPassword, email ])) {
        errors.push({ text: 'Please fill in all the spaces' });
    }

    if(!passwordUtil.checkPass(password, confirmPassword)) { 
        errors.push({ text: 'passwords must be uppercase, lowercase, special characters, have more than 8 digits and match each other'});
    } 
    
    if(errors.length > 0) {
        res.json(newReponse('Errors detected', 'Fail', { errors }));
    
    } else { 
        checkEmail(email, (err, users) => { 
            if(err) {
                res.json(newReponse(err, 'Error', { }));
                
            } else if(users) {
                res.json(newReponse(`Email ${ email } already use`, 'Error', { }));
                
            } else {    
                passwordUtil.encryptPass(password, async (err, hash) => { 
                    if(err) {
                        res.json(newReponse(err, 'Error', { }));
                        
                    } else { 
                        const data = await pool.query(dbQueriesUser.createUsers, [ name, email, hash, age, gender, 2 ]);
            
                        (data)
                        ? res.json(newReponse('User created', 'Success', { id: data.rows[0].user_ide }))
                        : res.json(newReponse('Error create user', 'Error', { }));     
                    }
                });
            }
        });
    }
}

const updateUserById = (req, res) => {
    const { name, email, age, gender } = req.body;
    const { id } = req.params; 
    const errors = [];

    if(!field.checkFields([ name, email, age, gender ])) {
        errors.push({ text: 'Please fill in all the spaces' });
    } 
    
    if(errors.length > 0) {
        res.json(newReponse('Errors detected', 'Fail', { errors }));
    
    } else {
        checkEmail(email, async (err, users) => {
            if(err) {
                res.json(newReponse(err, 'Error', { }));
            
            } else if(!users) {
                res.json(newReponse('user not found', 'Error', { }));
                
            } else {
                if(users[0].id != id) {
                    res.json(newReponse(`Email ${ email } already use`, 'Error', { }));
                    
                } else {   console.log('aqui:', gender);   
                    const data = await pool.query(dbQueriesUser.updateUserById, [ name, email, age, gender, id ]);
                
                    (data)
                    ? res.json(newReponse('User updated', 'Success', { }))
                    : res.json(newReponse('Error on update', 'Error', { }));
                }
            }        
        });       
    }
}

const updatePassById = async (req, res) => { 
    const { password, confirmPassword, oldPassword } = req.body;
    const { id } = req.params; 
    const errors = [];
    
    if(!field.checkFields([ password, confirmPassword, oldPassword ])) { 
        errors.push({ text: 'Please fill in all the spaces' });
    } 
    
    if(!passwordUtil.checkPass(password, confirmPassword)) { 
        errors.push({ text: 'passwords must be uppercase, lowercase, special characters, have more than 8 digits and match each other'});
    
    } 
    
    if(errors.length > 0) {
        res.json(newReponse('Errors detected', 'Fail', { errors }));
    
    } else {
        const user = await pool.query(dbQueriesUser.getUserById, [ id ]);

        if(user.rowCount <= 0) {
            res.json(newReponse('User not found', 'Error', { })); 
        
        } else {
            if(await bcryt.compare(oldPassword, user.rows[0].user_pas)) {
                passwordUtil.encryptPass(password, async (err, hash) => { 
                    if(err) { 
                        res.json(newReponse(err, 'Error', { }));
         
                    } else {
                        const data = await pool.query(dbQueriesUser.updatePassById, [ hash, id ]);
                        
                        (data) 
                        ? res.json(newReponse('Pass updated', 'Success', { }))
                        : res.json(newReponse('Error on update', 'Error', { }));
                    }
                });
            } else {
                res.json(newReponse('Old password no match', 'Error', { }));
            }
        } 
    }
}

const deleteUserById = async (req, res) => {
    const { id } = req.params;
    const data = await pool.query(dbQueriesUser.deleteUserById, [ id ]);
    
    (data)
    ? res.json(newReponse('User deleted successfully', 'Success', { }))
    : res.json(newReponse('Error on delete with id', 'Error', { }));
}


// Export
module.exports = { 
    login,
    getUser, 
    createUsers, 
    getUserById,
    updateUserById,
    updatePassById,
    deleteUserById
}