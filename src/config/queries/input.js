const table = 'input_form';

module.exports = {
    // Insert
    createInput: `INSERT INTO ${ table } (input_form_txt, type_input_form_ide, question_ide) VALUES ($1, $2, $3)`,
    
    
    // Select
    getAllInputs: `SELECT if.*, tif.type_input_form_des FROM ${ table } AS if 
    JOIN type_input_form AS tif ON tif.type_input_form_ide = if.type_input_form_ide`,
    getInputById: `SELECT if.*, tif.type_input_form_des FROM ${ table } AS if 
    JOIN type_input_form AS tif ON tif.type_input_form_ide = if.type_input_form_ide WHERE if.input_form_ide = $1`,
    getInputsByQuestion: `SELECT if.*, tif.type_input_form_des FROM ${ table } AS if 
    JOIN type_input_form AS tif ON tif.type_input_form_ide = if.type_input_form_ide WHERE if.question_ide = $1`,
    getInputsByType:`SELECT if.*, tif.type_input_form_des FROM ${ table } AS if 
    JOIN type_input_form AS tif ON tif.type_input_form_ide = if.type_input_form_ide WHERE if.type_input_form_ide = $1`,
    
    
    // Update
    updateInputById: `UPDATE ${ table } SET input_form_txt = $1, type_input_form_ide = $2 WHERE input_form_ide = $3`,
    

    // Delete
    deleteInputById: `DELETE FROM ${ table } WHERE input_form_ide = $1`,
    deleteInputByQuestionId: `DELETE FROM ${ table } WHERE dorm_ide = $1`
};