const Book = require ('../models/Books');
const fs = require ('fs');
const path = require ('path');
const convertToWebp = require('../utilities/convertWebp');
const { FILE } = require('dns');


exports.createBook = async (req, res, next)=>{
    try{
        const bookObject = JSON.parse (req.body.book);
        
        delete bookObject._id;
        delete bookObject._userId; 

        const webpImagePath = await convertToWebp(req.file.path); //converti img au format webp
        const webpFilename = path.basename(webpImagePath); //récup le nom du fichier
    
        const book = new Book({
            ...bookObject,
            userId:req.auth.userId,
            imageUrl : `${req.protocol}://${req.get('host')}/images/${webpFilename}`,
            averageRating: 0, 
            ratings: [] 
        });

        await book.save();
        console.log("✅ Livre enregistré, envoi réponse 201");
        res.status(201).json({message: 'livre enregistré'});

    } catch (error) {
        
        console.error("❌ Erreur dans createBook :", error);
        res.status(400).json ({error});
    } 
};

exports.ratingBook = (req, res, next) =>{
    const BookId = req.params.id;
    const {userId, rating} = req.body;

    if (!userId) {
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
        .then((books) =>{
            res.status(200).json(books);
        }) 
        .catch((error) => {
            res.status(500).json ({error});
        });
};

exports.getOneBook = (req, res, next)=>{
    Book.findOne ({_id:req.params.id})
          .then(book => {
            if (!book) return res.status(404).json({ error: 'Livre non trouvé' });
            res.status(200).json(book);
            })
        .catch(error => res.status(500).json(error));
};

exports.bestRating = (req, res, next) =>{
    Book.find()
        .sort({averageRating: -1}) //trier par note moyenne décroissante
        .limit (3) //limiter a 3 livres
        .then(books => res.status(200).json (books))
        .catch (error => res.status(500).json ({error}));
}

exports.modifyBook = async (req,res,next)=>{
    try{
        const book = await Book.findOne({_id: req.params.id})

        if (!book) return res.status(404).json({message : 'Livre non trouvé'})
        if (book.userId != req.auth.userId){
                console.log("🔒 Identification requise");
                res.status(403).json ({message :'Non autorisé'});
        }

        let bookObject;

        if(req.file){

            //convertir img en webp
            const convertedPath=await convertToWebp (req.file.path);
            const webpFilename = path.basename(convertedPath);
            const imageUrl = `${req.protocol}://${req.get('host')}/images/${webpFilename}`
        
            //supp ancienne image (ancienne webp)
            const oldImageName = book.imageUrl?.split ("/images/")[1];
            if (oldImageName){
                const oldImagePath = path.join("images", oldImageName);
                try{
                    await fs.unlink(oldImagePath);
                    console.log("Ancienne image supprimée", oldImageName);
                }catch (err){
                    console.log("Impossible de supprimer l'ancienne image", err.message)
                }
            }

         bookObject = {
        ...JSON.parse (req.body.book),
        imageUrl,
        } ;
        }else{
        bookObject = {...req.body};
        } 

        delete bookObject._userId;

        await Book.updateOne ({_id:req.params.id}, {...bookObject, _id: req.params.id})
            console.log("✅ Livre modifié");
            res.status(200).json ({message : "Objet modifié"});
    }catch (error){
        console.log("❌ Erreur lors de la modification du livre :", error);
        res.status(400).json({error});
    }
};

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then(book => {
      if (!book) {
        return res.status(404).json({ message: 'Livre non trouvé' });
      }

      if (String(book.userId) !== String(req.auth.userId)) {
        return res.status(403).json({ message: 'Non autorisé' });
      }

      const filename = book.imageUrl.split('/images/')[1];
      fs.unlink(path.join('images', filename), () => {
        Book.deleteOne({ _id: req.params.id })
         .then(() => {
            console.log('✅ Livre supprimé');
            res.status(200).json({ message: 'Livre supprimé' });
        })
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};


