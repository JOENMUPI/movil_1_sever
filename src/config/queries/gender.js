const table = 'gender';

module.exports = {
    // Insert
    createGender: `INSERT INTO ${ table } (gender_des) VALUES ($1)`,
    
    
    // Select
    getAllGenders: `SELECT * FROM ${ table }`,
    getGenderById: `SELECT * FROM ${ table } WHERE gender_ide = $1`,
    getGenderByDescription: `SELECT * FROM ${ table } WHERE gender_des = $1`,
    
    
    // Update
    updateGenderById: `UPDATE ${ table } SET gender_des = $1 WHERE gender_ide = $2`,
    

    // Delete
    deleteGenderById: `DELETE FROM ${ table } WHERE gender_ide = $1`
};