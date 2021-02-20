const table = 'section_form';

module.exports = {
   // Insert
   createSection: `INSERT INTO ${ table } (section_form_tit, section_form_des, form_ide) VALUES ($1, $2, $3)`,
    
    
   // Select
   getAllSections: `SELECT * FROM ${ table }`,
   getSectionById: `SELECT * FROM ${ table } WHERE section_ide = $1`,
   getSectionsByForm: `SELECT * FROM ${ table } WHERE form_ide = $1`,
   
   
   // Update
   updateSectionById: `UPDATE ${ table } SET section_tit = $1, section_des = $2 WHERE section_ide = $3`,
   

   // Delete
   deleteSectionById: `DELETE FROM ${ table } WHERE section_ide = $1`
};