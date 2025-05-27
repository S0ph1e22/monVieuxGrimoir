const multer = require ('multer');

const MIME_TYPES ={
    'image/jpg' : 'jpg',
    'image/jpeg' : 'jpeg',
    'image/png' : 'png'
};

const storage = multer.diskStorage({
//indique a multer d'enregistrer les fichiers dans le dossier image
    destination: (req, file, callback) =>{
        callback(null, 'images');
    },
    //indique a multer d'utiliser le nom d'origine
    filename: (req, file, callback)=>{
    //remplacer les espaces par des _
        const name = file.originalname.split(' ').join('_');
        //MIME pour résoudre l'exentsion de fichier approprié
        const extension = MIME_TYPES[file.mimetype];
        //ajouter un datenow comme nom de fichier
        callback(null, name + Date.now() + '.' + extension);
    }
});

//export de multer, on indique qu'on gere uniquement les telechargements de fichier image
module.exports = multer({storage: storage}).single('image');