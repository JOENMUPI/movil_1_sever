const table = 'sub_menu';

module.exports = {
    // Insert
    createMenu: `INSERT INTO ${ table } (gender_des) VALUES ($1)`,
    
    
    // Select
    getMenuById: `WITH RECURSIVE parents AS (SELECT * FROM ${ table } WHERE sub_menu_ide = $1 
    UNION ALL SELECT ${ table }.* FROM ${ table }
    JOIN parents ON ${ table }.parent_sub_menu_ide = parents.sub_menu_ude) SELECT * FROM parents`,
    
    
    // Update
    updateMenuById: `UPDATE ${ table } SET sub_menu_tit = $1,  WHERE sub_menu_ide = $2`,
    

    // Delete
    deleteMenuById: `DELETE FROM ${ table } WHERE sub_menu_ide = $1`
};