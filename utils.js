const jwt = require('jsonwebtoken');

function getUserByToken(req){
    console.log("req: ", req)
    if(req.headers.authorization && req.headers.authorization.includes('bearer')){
        const token = req.headers.authorization.split(" ")[1];
        if(token){
            const data = jwt.verify(token, "secret");
            console.log(data);
        }
    }
}

module.exports = {
    getUserByToken,
}