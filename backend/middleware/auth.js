 const jwt = require ('jsonwebtoken'); // permet de vérifier et décoder les token

 module.exports = (req, res, next) =>{
    try{
        //on récup le token, split [1] permet d'extraire uniqumeent le token en enlevant le mot barear
        const token = req.headers.authorization.split(' ')[1]; 
        // si token valide et signé avec mm clé secrète, décodé, sinon erreur
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        //on extrait id de l'utilisateur depuis le token décodé
        const userId = decodedToken.userId;
        //ajout auth qui contient id de l'utilisateur
        req.auth = {
            userId : userId
        };
        //next pour passer au middleware/routes suivant
        next();
    }catch (error){
        res.status(401).json({error});
    }
 }