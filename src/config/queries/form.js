const table = 'form';

module.exports = {
   // Insert
   createForm: `INSERT INTO ${ table } (form_tit, form_dat, user_ide, sub_menu_ide) VALUES ($1, $2, $3, $4) 
   RETURNING form_ide`,
    
    
   // Select
   getAllForms: `SELECT * FROM ${ table }`,
   getFormById: `SELECT * FROM ${ table } WHERE form_ide = $1`,
   getFormsByUser: `SELECT * FROM ${ table } WHERE user_ide = $1`,
   getFormByMenu: `SELECT * FROM ${ table } WHERE sub_menu_ide = $1`,
   checkFormForResponses: `SELECT rf.* FROM ${ table } AS f
   JOIN section_form AS sf ON f.form_ide = sf.form_ide
   JOIN question AS q ON q.section_form_ide = sf.section_form_ide
   JOIN input_form AS if ON if.question_ide = q.question_ide
   JOIN response_form AS rf ON rf.input_form_ide = if.input_form_ide WHERE f.form_ide = $1`,

   getMegaFormById: `SELECT f.*, sf.*, q.*, if.*, tif.* FROM ${ table } AS f
   JOIN section_form AS sf ON f.form_ide = sf.form_ide
   JOIN question AS q ON q.section_form_ide = sf.section_form_ide
   JOIN input_form AS if ON if.question_ide = q.question_ide
   JOIN type_input_form AS tif ON tif.type_input_form_ide = if.type_input_form_ide WHERE f.form_ide = $1`,
   
   
   // Update
   updateFormById: `UPDATE ${ table } SET form_tit = $1, WHERE form_ide = $2`,
   

   // Delete
   deleteFormById: `DELETE FROM ${ table } WHERE role_ide = $1`
};