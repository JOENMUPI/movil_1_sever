const Pool = require('pg').Pool;
const bcryt = require('bcryptjs');
const dbConfig = require('../config/db_config');
const dbQueries = require('../config/db_quieries_user');
const password = require('../helper/password');
const field = require('../helper/field');

// Variables
let send = {
    message: '',
    body: { }
}

const pool = new Pool(dbConfig);


// Helper
const sendReset = () => {
    send = {  message: '', body: { } }
}

const checkFields = (fields) => {
    let flag = true;

    fields.forEach((Element) => {
        if(Element.length <= 0) {
            flag = false;
        }
    });

    return flag;
}

const checkEmail = (email, callBack) => {
    pool.query(dbQueries.getUserByEmail, [ email ]).then((data) => {
        if(data.rows.length > 0) {
            return callBack(null, data.rows);
        
        } else {
            return callBack(null, null);
        }

    }).catch((err) => {
        return callBack(err);
    });
}


// Logic
const login = (req, res) => {
    const { email, pass } = req.body;

    sendReset();
    pool.query(dbQueries.getUserByEmail, [ email ]).then((data) => { 
        if(data.rows.length > 0) { 
            bcryt.compare(pass, data.rows[0].user_pas, (err, match) => { 
                if(err) {
                    send.message = 'Error comparing pass';
                    send.body = err;
                    res.json(send);
                
                } else if (!match) {
                    send.message = 'Incorrect password';
                    res.json(send);
                    
                } else {
                    send.message = 'Logged successfully'
                    send.body =  { 
                        name: data.rows.user_nam,
                        lastname: data.rows.user_las_nam,
                        email 
                    }

                    res.json(send);
                    //send jwt
                }
            });
        } else { 
            send.message = 'Email not found';
            res.json(send);
        }
    }).catch((err) => { 
        send.message = 'Error searching user with id';
        send.body = { err }
    });
}

const getUser = (req, res) => {
    sendReset();
    pool.query(dbQueries.getUsers).then((data) => {
        send.message = 'All users';
        send.body = { users: data.rows } 

    }).catch((err) => {
        send.message = 'Error searhing the users';
        send.body = { err }
        console.log('error aqui:', err);
    
    }).finally(() => {
        res.json(send);
    });
}

const getUserById = (req, res) => {
    sendReset();
    pool.query(dbQueries.getUserById, [ req.params.id ]).then((data) => {
        if(data.rows.length > 0) {
            send.message = 'User found';
            send.body = { user: data.rows }

        } else {
            send.message = 'User not found';
        }
        
    }).catch((err) => {
        send.message = 'Error searching user with id';
        send.body = { err }
    
    }).finally(() => {
        res.json(send);
    });
}

const createUsers = (req, res) => {  
    const { name, lastname, pass, confirmPass, email } = req.body;
    const errors = [];
    
    sendReset();
    if(!field.checkFields([ name, pass, confirmPass, email, lastname ])) {
        errors.push({ text: 'Please fill in all the spaces' });
    }

    if(!password.checkPass(pass, confirmPass)) { 
        errors.push({ text: 'passwords must be uppercase, lowercase, special characters, have more than 8 digits and match each other'});
    } 
    
    if(errors.length > 0) {
        send.message = 'Error detected';
        send.body = { name, lastname, email, errors };
    
    } else { 
        checkEmail(email, (error, data) => {
            if(error) { 
                send.message = 'Error on checkEmail';
                send.body = { error }
            
            } else if(data) { 
                send.message = `Email ${ email } already use`;
                res.json(send);
                
            } else {    
                password.encryptPass(pass, (error2, hash) => { 
                    if(error) { 
                        send.message = 'Error on encrypt';
                        send.body = { error2 }
                        res.json(send);
                    
                    } else { 
                        pool.query(dbQueries.createUsers, [ name, lastname, hash, email ]).then((data) => { 
                            send.message = 'User created';
                            send.body = { user: { name, email } } 
                
                        }).catch((err) => { 
                            send.message = 'Error create user';
                            send.body = { err }                
                        }).finally(() => { 
                            res.json(send);
                        });
                    }
                });
            }
        });
    }
}

const updateUserById = (req, res) => {
    const { name, lastname, email } = req.body;
    const { id } = req.params; 
    const errors = [];

    
    sendReset();
    if(!field.checkFields([ name, email, lastname ])) {
        errors.push({ text: 'Please fill in all the spaces' });
    
    } else if(errors.length > 0) {
        send.message = 'Error detected';
        send.body = { name, lastname, email, errors };
        res.json(send);
    
    } else {
        checkEmail(email, (error, data) => {
            if(error) {
                send.message = 'Error on checkEmail'
                send.body = error;
                res.json(send);

            } else if(!data) {
                send.message = 'user not found'
                send.body = error;
                res.json(send);

            } else {
                if(data[0].user_ide != id) {
                    send,message = `Email ${ email } already use`;
                    send.body = { name, lastname }
                    res.json(send);

                } else {
                    pool.query(dbQueries.updateUserById, [ name, lastname, email, id ]).then((data) => {    
                        send.message = 'User updated';    
                        send.body = { name, email } 
                    
                    }).catch((err) => {
                        send.message = 'Error on update';
                        send.body = { err }
                    
                    }).finally(() => {
                        res.json(send);
                    });
                }
            }        
        });       
    }
}

const updatePassById = (req, res) => {
    const { pass, confirmPass} = req.body;
    const { id } = req.params; 
    const errors = [];
    
    sendReset();
    if(!field.checkFields([ pass, confirmPass ])) {
        errors.push({ text: 'Please fill in all the spaces' });
    } 
    
    if(!password.checkPass(pass, confirmPass)) {
        errors.push({ text: 'passwords must be uppercase, lowercase, special characters, have more than 8 digits and match each other'});
    
    } else if(errors.length > 0) {
        send.message = 'Error detected';
        send.body = { errors };
        res.json(send);
    
    } else {
        password.encryptPass(pass, (error, hash) => { 
            if(error) { 
                send.message = 'Error on encrypt';
                send.body = { error }
            
            } else {
                pool.query(dbQueries.updatePassById, [ hash, id ]).then((data) => {    
                    send.message = 'Pass updated';    
            
                }).catch((err) => {
                    send.message = 'Error on update';
                    send.body = { err }
                
                }).finally(() => {
                    res.json(send);
                });
            }
        });
    }
}

const deleteUserById = (req, res) => {
    const { id } = req.params;

    sendReset();
    pool.query(dbQueries.deleteUserById, [ id ]).then((data) => {
        send.message = 'User deleted successfully';
        
    }).catch((err) => { console.log('Error on delete:', err);
        send.message = 'Error on delete';
        send.body = { err }
    
    }).finally(() => {
        res.json(send);
    });
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