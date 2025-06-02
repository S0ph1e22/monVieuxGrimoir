const express = require ('express');
const router = express.Router();
const auth = require ('../middleware/auth');
const multer = require ('../middleware/multer-config')

const bookCtrl = require ('../controllers/book');

router.post('/',auth, multer, bookCtrl.createBook);
router.post('/:id/rating',auth, bookCtrl.ratingBook);

router.get ('/bestrating', bookCtrl.bestRating);
router.get ('/',bookCtrl.getAllBook);
router.get('/:id', bookCtrl.getOneBook);

router.put ('/:id',auth, multer, bookCtrl.modifyBook);

router.delete('/:id',auth, bookCtrl.deleteBook);

module.exports = router;