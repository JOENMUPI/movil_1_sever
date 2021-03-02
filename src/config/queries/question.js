const table = 'question';

module.exports = {
    // Insert
    createQuestion: `INSERT INTO ${ table } (question_tit, question_obl, section_form_ide, type_input_form_ide) VALUES ($1, $2, $3, $4) 
    RETURNING question_ide`,
    
    
    // Select
    getAllQuestions: `SELECT q.*, tif.type_input_form_des FROM ${ table } AS q
    JOIN type_input_form AS tif ON tif.type_input_form_ide = q.type_input_form_ide`,
    getQuestionById: `SELECT  q.*, tif.type_input_form_des FROM ${ table } AS q
    JOIN type_input_form AS tif ON tif.type_input_form_ide = q.type_input_form_ide WHERE question_ide = $1`,
    getQuestionsBySection: `SELECT q.*, tif.type_input_form_des FROM ${ table } AS q
    JOIN type_input_form AS tif ON tif.type_input_form_ide = q.type_input_form_ide WHERE section_form_ide = $1`,
    
    
    // Update
    updateQuestionById: `UPDATE ${ table } SET question_tit = $1, question_obl = $2, type_input_form_ide = $3 WHERE question_ide = $4`,
    

    // Delete
    deleteQuestionById: `DELETE FROM ${ table } WHERE question_ide = $1`,
    deleteQuestionBysectionId: `DELETE FROM ${ table } WHERE section_form_ide = $1`
};