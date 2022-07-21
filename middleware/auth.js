const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const clePrivee = process.env.JWT_CLE_PRIVEE;
        const decodedToken = jwt.verify(token, clePrivee);
        const userId = decodedToken.userId;
        if(!userId){throw "token invalid";}
        req.auth = { userId };
        next();
    } catch {
        res.status(401).json({
            error: "Utilisateur non autorisé!",
        });
    }
};




