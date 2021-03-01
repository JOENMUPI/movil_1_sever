const Pool = require('pg').Pool;
const auth = require('../utilities/auth');

// Variables


// Utilities
const newReponse = (message, typeResponse, body) => {
    return { message, typeResponse, body }
}


// Logic
const authUser = async (req, res) => {
    const { userId } = req.params;
    const data = await auth.AuthAdmin(userId);

    res.json(newReponse('authUser', 'Success', data))
}


// Export
module.exports = {
    authUser,
}