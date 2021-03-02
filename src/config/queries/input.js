const table = 'input_form';

module.exports = {
    // Insert
    createInput: `INSERT INTO ${ table } (input_form_txt, question_ide) VALUES ($1, $2)`,
    
    
    // Select
    getAllInputs: `SELECT * FROM ${ table }`,
    getInputById: `SELECT * FROM ${ table } WHERE input_form_ide = $1`,
    getInputsByQuestion: `SELECT * FROM ${ table } WHERE question_ide = $1`,
    
    
    // Update
    updateInputById: `UPDATE ${ table } SET input_form_txt = $1, type_input_form_ide = $2 WHERE input_form_ide = $3`,
    

    // Delete
    deleteInputById: `DELETE FROM ${ table } WHERE input_form_ide = $1`,
    deleteInputByQuestionId: `DELETE FROM ${ table } WHERE dorm_ide = $1`
};