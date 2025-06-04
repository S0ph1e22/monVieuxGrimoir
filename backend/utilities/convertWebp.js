const sharp = require ("sharp");
const fs = require ('fs');
const path = require("path");

module.exports = async (inputPath) => {
    const outputPath = inputPath.replace (/\.(jpg|jpeg|png)$/i, '.webp');


await sharp (inputPath)
    .resize ({
        width : 2000,
        height : 1000,
        fit : "inside", // évite de déformer img
    })
    .toFormat ('webp')
    .toFile(outputPath);

    fs.unlink("/images"+path,function(error){ //supp l'img original
        if (error){
            console.log("erreur suppression image originiale : ", error);
        }
    }); 

    return outputPath;
};