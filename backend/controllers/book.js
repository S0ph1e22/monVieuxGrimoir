const Book = require ('../models/Books');

exports.createBook = (req, res, next)=>{
    delete req.body._id;
    const book = new Book({
        ...req.body
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
    Book.updateOne({_id:req.params.id}, {...req.body,_id : req.params.id})
        .then(()=> res.status(200).json ({message : 'livre modifié'}))
        .catch(error => res.status(400).json ({error}));
};

exports.deleteBook = (req, res, next)=>{
    Book.deleteOne ({_id: req.params.id})
        .then(()=> res.status(200).json({message :'livre supprimé'}))
        .catch(error => res.status(400).json ({error}));
};

