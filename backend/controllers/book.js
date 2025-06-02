const Book = require ('../models/Books');

exports.createBook = (req, res, next)=>{
    console.log('Requête reçue:', req.body);
    const bookObject = JSON.parse (req.body.book);
    
    delete bookObject._id;
    delete bookObject._userId; 

    const book = new Book({
        ...bookObject,
        imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    book.save()
        .then(()=> res.status(201).json({message: 'livre enregistré'}))
        .catch(error => res.status(400).json ({error}));
};

exports.ratingBook = (req, res, next) =>{
    const BookId = req.params.id;
    const {userId, rating} = req.body;

    if (!userId || typeof rating !== 'number' || rating < 0  || rating > 5) {
        return res.status(400).json ({error : 'données invalides'});
    }

    Book.findOne({_id: BookId})
        .then (book =>{
            if (!book) return res.status(404).json ({error : 'livre non trouvé'});

            //vérifie si utilisateur a deja noté livre
            const alreadyRated = book.ratings.find (r => r.userId === userId); //prend chaque élément r du tableau et vérif si r.userId est égal a userId
            if (alreadyRated){
                return res.status(400).json ({error : 'livre déja noté'});
            }

            //ajout de la nouvelle note
            book.ratings.push ({userId, grade : rating});

            //calcul de la moyenne des notes
                //reduce pour réduire le tableau a une seule valeur, prend 2 arguments (accumulateur et elementcourant)
                //sum (accumulateur) : somme cumulée
                // r objet dans le tableau
                //r.grade : note de l'utilisateur
                // 0 : valeur inital de sum
            const total = book.ratings.reduce ((sum,r) => sum + r.grade, 0);
                //somme des notes / nb de notes
                // x10
                // math round pour arrondir a l'entier le + proche
                // /10 pour remettre le chiffre après la virgule
            book.averageRating = Math.round ((total/book.ratings.length) * 10) /10;

            //enregistre le livre mis a jour
            return book.save()
                .then(updateBook => res.status(200).json (updateBook))
                .catch(error => res.status(400).json ({error}));
            })
        .catch (error => res.status(500).json ({error}));
}

exports.getAllBook = (req, res, next)=>{
    Book.find()
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json ({error}));
};

exports.getOneBook = (req, res, next)=>{
    Book.findOne ({_id:req.params.id})
        .then (book =>res.status(200).json (book))
        .catch(error => res.status(404).json(error));
};

exports.bestRating = (req, res, next) =>{
    Book.find()
        .sort({averageRating: -1}) //trier par note moyenne décroissante
        .limit (3) //limiter a 3 livres
        .then(books => res.status(200).json (books))
        .catch (error => res.status(400).json ({error}));
}

exports.modifyBook = (req,res,next)=>{
    const bookObject = req.file ? {
        ...JSON.parse (req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body};

    delete bookObject._userId;
    Book.findOne({_id: req.params.id})
        .then((book)=>{
            if (book.userId != req.auth.userId){
                res.status(401).json ({message :'Non autorisé'});
            } else {
                Book.updateOne ({_id:req.params.id}, {...bookObject, _id: req.params.id})
                    .then(()=> res.status(200).json ({message : "Objet modifié"}))
                    .catch(error => res.status(401).json({error}));
            }
        })
        .catch((error) => res.status(400).json ({error}));
};

exports.deleteBook = (req, res, next)=>{
    Book.findOne({_id: req.params.id})
        .then(book =>{
            if (book.userId != req.auth.userId){
                res.status(400).json ({message : 'Non autorisé'});
            } else {
                const filename = book.imageUrl.split ('/images') [1];
                fs.unlink(path.join ('images',filename),()=>{
                    Book.deleteOne({_id:req.params.id})
                        .then(()=> res.status(200).json ({message : 'objet supprimé'}))
                        .catch(error => res.status(401).json({error}))
                });
            }
        })
        .catch (error => { res.status(500).json ({error})});
};

