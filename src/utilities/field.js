// Logic
const checkFields = (fields) => {
    let flag = true;

    fields.forEach((Element) => {
        if(Element.length <= 0) {
            flag = false;
        }
    });

    return flag;
}


// Export
module.exports = {
    checkFields
}