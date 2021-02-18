const bcryt = require('bcryptjs');


// Logic
const checkPass = (pass, confirmPass) => {
    if(pass.length >= 8) {		
        let capitalLetter = false;
        let lowercaseLetter = false;
        let number = false;
        let specialLetter = false;
        
        for(var i = 0; i < pass.length; i++) {
            if(pass.charCodeAt(i) > 64 && pass.charCodeAt(i) < 91) {
                capitalLetter = true;
            
            } else if(pass.charCodeAt(i) > 96 && pass.charCodeAt(i) < 123) {
                lowercaseLetter = true;
            
            } else if(pass.charCodeAt(i) > 47 && pass.charCodeAt(i) < 58) {
                number = true;
            
            } else {
                specialLetter = true;
            }

        }
        
        if(capitalLetter && lowercaseLetter && specialLetter && number && confirmPass == pass) {
            return true;
        
        } else {
            return false;
        }
    }
}

const encryptPass = (pass, callBack) => {
    bcryt.genSalt(10, (err, salt) => {
        if(err) { 
            return callBack(err);
        
        } else {
            bcryt.hash(pass, salt, (err, hash) => {
                if(err) { 
                    return callBack (err);
                    
                } else { 
                    return callBack(null, hash);
                }
            });
        }
    });
}


// Export
module.exports = {
    encryptPass,
    checkPass
}