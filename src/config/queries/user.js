const table = 'user_1';

module.exports = {
    // Insert
    createUsers: `INSERT INTO ${ table } (user_nam, user_ema, user_pas, user_age, gender_ide, role_ide) VALUES ($1, $2, $3, $4, $5, $6)`,
    
    
    // Select
    getAllUsers: `SELECT u.*, g.gender_des,  FROM ${ table } AS u 
    JOIN gender AS g ON g.gender_ide = u.gender_ide`,
    getUserById: `SELECT u.*, g.gender_des FROM ${ table } AS u 
    JOIN gender AS g ON g.gender_ide = u.gender_ide WHERE u.user_ide = $1`,
    getUserByEmail: `SELECT u.*, g.gender_des ${ table } AS u 
    JOIN gender AS g ON g.gender_ide = u.gender_ide WHERE u.user_ema = $1`,
    getUsersByEmailAndPassword: `SELECT u.*, g.gender_des, FROM ${ table } AS u 
    JOIN gender AS g ON g.gender_ide = u.gender_ide WHERE u.user_email = $1 AND u.user_pas = $2`,
    getUsersByRole: `SELECT u.*, g.gender_des FROM ${ table } AS u 
    JOIN gender AS g ON g.gender_ide = u.gender_ide WHERE u.role_ide = $1`,
    getUsersByGender: `SELECT u.*, g.gender_des FROM ${ table } AS u 
    JOIN gender AS g ON g.gender_ide = u.gender_ide WHERE u.gender_ide = $1`,
    

    // Update
    updateUserById: `UPDATE ${ table } SET user_nam = $1, user_ema, user_pas = $3, user_age = $4, gender_ide = $5 WHERE user_ide = $6`,
    updatePassById: `UPDATE ${ table } SET user_pas = $1 WHERE user_ide = $2`,


    // Delete
    deleteUserById: `DELETE FROM ${ table } WHERE user_ide = $1`
};