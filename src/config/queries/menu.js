const table = 'sub_menu';

module.exports = {
    // Insert
    createMenu: `INSERT INTO ${ table } (sub_menu_tit, sub_menu_dat, parent_sub_menu_ide, user_ide) VALUES ($1, $2, $3, $4) 
    RETURNING sub_menu_ide`,
    
    
    // Select
    getAllMenus: `SELECT * FROM ${ table }`,
    getMenusWithoutParentId: `SELECT * FROM ${ table } WHERE parent_sub_menu_ide is null`,
    getMenuById:`SELECT * FROM ${ table } WHERE sub_menu_ide = $1`,

    getMenuByIdWithRec: `WITH RECURSIVE parents AS (SELECT * FROM ${ table } WHERE sub_menu_ide = $1 
    UNION ALL SELECT ${ table }.* FROM ${ table }
    JOIN parents ON ${ table }.parent_sub_menu_ide = parents.sub_menu_ide) SELECT * FROM parents`,
    
    
    // Update
    updateMenuById: `UPDATE ${ table } SET sub_menu_tit = $1, parent_sub_menu_ide = $2  WHERE sub_menu_ide = $3`,
    

    // Delete
    deleteMenuById: `DELETE FROM ${ table } WHERE sub_menu_ide = $1`
};