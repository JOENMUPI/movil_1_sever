const table = 'user_1';

module.exports = {
    getUsers: `SELECT * FROM ${ table }`,
    getUserById: `SELECT * FROM ${ table } WHERE user_ide = $1`,
    getUserByEmail: `SELECT * FROM ${ table } WHERE user_ema = $1`,
    createUsers: `INSERT INTO ${ table } (user_nam, user_las_nam, user_pas, user_ema) VALUES ($1, $2, $3, $4)`,
    updateUserById: `UPDATE ${ table } SET user_nam = $1, user_las_nam = $2, user_ema = $3 WHERE user_ide = $4`,
    updatePassById: `UPDATE ${ table } SET user_pas = $1 WHERE user_ide = $2`,
    deleteUserById: `DELETE FROM ${ table } WHERE user_ide = $1`
};