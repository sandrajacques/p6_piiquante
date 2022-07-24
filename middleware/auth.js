const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];//extraire le token du header Authorization
        const clePrivee = process.env.JWT_CLE_PRIVEE;//la clé privée du token
        const decodedToken = jwt.verify(token, clePrivee);//décryptage du token avec la clé privée
        const userId = decodedToken.userId;//récupération du userId depuis le token décrypté
        
        if(!userId){throw "token invalid";}//si userId est inexistant, lancement d'une erreur
        req.auth = { userId };//sir userId existe, on l'insère dans req.auth
        next();//pour passer à la suite du middleware
    } catch {//si le token est invalide on renvoie une réponse http 401
        res.status(401).json({
            error: "Utilisateur non autorisé!",
        });
    }
};




