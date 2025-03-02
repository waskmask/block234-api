const constants = require('../config');
const helper = require('../utils/helper');
const jwt = require("jsonwebtoken");

module.exports = {
    validateToken: (req, res, next) => {
        const authorizationHeaader = req.headers.authorization;
        let result;
        if (authorizationHeaader) {
            const token = req.headers.authorization.split(' ')[1]; // Bearer <token>
            const options = {
                expiresIn: '72h'
            };
            try {
                // verify makes sure that the token hasn't expired and has been issued by us
                result = jwt.verify(token, constants.JWT_SECRET, options);
                // Let's pass back the decoded token to the request object
                req.decoded = result;
                // We call next to pass execution to the subsequent middleware                
                next();
            } catch (err) {
                if (err.name) {
                    if (err.name == 'TokenExpiredError') {
                        err.message = 'Authentication error, Token expired.'
                    }
                    let result;
                    helper.send(res, 401, err.message);
                }
                // Throw an error just in case anything goes wrong with verification
                // throw new Error(err);
            }
        } else {
            let result;
            let errMsg = 'Authentication error, Token required.'
            helper.send(res, 401, errMsg);
        }
    },
    getPayload:(req)=>{
        const authorizationHeaader = req.headers.authorization;
        let result;
        if (authorizationHeaader) {
            const token = req.headers.authorization.split(' ')[1]; // Bearer <token>
            const options = {
                expiresIn: '72h'
            };
            try {
                // verify makes sure that the token hasn't expired and has been issued by us
                result = jwt.verify(token, constants.JWT_SECRET, options);
            } catch (err) {
                result = null;
            }
        }else{
            result = null;
        }
        return result;
    }
};
