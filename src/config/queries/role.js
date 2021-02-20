const table = 'role';

module.exports = {
    // Insert
    createRole: `INSERT INTO ${ table } (role_des) VALUES ($1)`,
    
    
    // Select
    getAllRoles: `SELECT * FROM ${ table }`,
    getRoleById: `SELECT * FROM ${ table } WHERE role_ide = $1`,
    getRoleByDescription: `SELECT * FROM ${ table } WHERE role_des = $1`,
    
    
    // Update
    updateRoleById: `UPDATE ${ table } SET role_des = $1 WHERE role_ide = $2`,
    

    // Delete
    deleteRoleById: `DELETE FROM ${ table } WHERE role_ide = $1`
};