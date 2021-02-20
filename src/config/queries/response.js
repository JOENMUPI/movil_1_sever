const table = 'response_form';

module.exports = {
   // Insert
   createResponse: `INSERT INTO ${ table } (response_form_jso, response_dat, user_ide, input_form_ide) VALUES ($1, $2, $3, $4)`,
    
    
   // Select
   getAllResponses: `SELECT * FROM ${ table }`,
   getResponseById: `SELECT * FROM ${ table } WHERE user_ide = $1 AND input_form_ide = $2`,
   checkResponseByInput: `SELECT * FROM ${ table } WHERE input_form_ide = $1`,
   
   
   // Update
   updateSectionById: `UPDATE ${ table } SET response_jso = $1, response_dat = $2 WHERE user_ide = $3 AND input_form_ide = $4`,
   

   // Delete
   deleteResponseById: `DELETE FROM ${ table } WHERE user_ide = $1 AND input_form_ide = $2`
};