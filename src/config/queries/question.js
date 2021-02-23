const table = 'question';

module.exports = {
    // Insert
    createQuestion: `INSERT INTO ${ table } (question_tit, question_obl, section_form_ide) VALUES ($1, $2, $3) 
    RETURNING question_ide`,
    
    
    // Select
    getAllQuestions: `SELECT * FROM ${ table }`,
    getQuestionById: `SELECT * FROM ${ table } WHERE question_ide = $1`,
    getQuestionsBySection: `SELECT * FROM ${ table } WHERE section_form_ide = $1`,
    
    
    // Update
    updateQuestionById: `UPDATE ${ table } SET question_tit = $1, question_obl = $2 WHERE question_ide = $3`,
    

    // Delete
    deleteQuestionById: `DELETE FROM ${ table } WHERE question_ide = $1`
};