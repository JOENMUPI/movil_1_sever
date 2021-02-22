const table = 'type_input_form';

module.exports = {
    // Insert
    createTypeInput: `INSERT INTO ${ table } (type_input_form_des) VALUES ($1)`,
    
    
    // Select
    getAllTypeInputs: `SELECT * FROM ${ table }`,
    getTypeInputById: `SELECT * FROM ${ table } WHERE type_input_form_ide = $1`,
    getTypeInputByDescription: `SELECT * FROM ${ table } WHERE type_input_form_des = $1`,
    
    
    // Update
    updateTypeInputById: `UPDATE ${ table } SET type_input_form_des = $1 WHERE type_input_form_ide = $2`,
    

    // Delete
    deleteTypeInputById: `DELETE FROM ${ table } WHERE type_input_form_ide = $1`
};