const mongoose = require ('mongoose');

const bookSchema = mongoose.Schema({
    title : {type : String, required : true},
    imageUrl : {type : String, required: true},
    userId : {type : String, required : true},
    genre: { type: String },
    year: { type: Number },
    ratings: [
        {
        userId: { type: String, required: true },
        grade: { type: Number, required: true }
        }
    ],
    averageRating: { type: Number, required: true }
});

module.exports = mongoose.model('Book', bookSchema);