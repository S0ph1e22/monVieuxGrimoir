const multer = require ('multer');

//on crée un objet qui associe les types MIME a leur extensions de fichiers pour donner la bonne au fichier enregistré
const MIME_TYPES ={
    'image/jpg' : 'jpg',
    'image/jpeg' : 'jpeg',
    'image/png' : 'png'
};

//on enregistre les fichiers sur le disque localement
const storage = multer.diskStorage({
//indique a multer d'enregistrer les fichiers dans le dossier image
// callback = pas d'erreur, met le fichier ici
    destination: (req, file, callback) =>{
        callback(null, 'images');
    },
    //indique a multer d'utiliser le nom d'origine
    filename: (req, file, callback)=>{
    //remplacer les espaces par des _
        const name = file.originalname.split(' ').join('_');
        //MIME pour résoudre l'exentsion de fichier approprié
        const extension = MIME_TYPES[file.mimetype];
        //génère un nb entier aléatoire entre 0 et 9999, math random donne un nb décimal, x10000 et on arrondi a l'entier supp
        const random = Math.floor(Math.random()*10000);
        const filename = `${name}_${random}.${extension}`;
        callback(null, filename);
    }
});


//export de multer, on indique qu'on gere uniquement les telechargements de fichier image
module.exports = multer({storage: storage}).single('image');