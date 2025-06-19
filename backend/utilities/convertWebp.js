const sharp = require ("sharp"); //pour redimensionner et convertir l'img
const fs = require ('fs').promises; // pour gérer les fichier en asynchrone (unlink)

//fonction asynch qui prend en entrée le chemin de l'img (inputPath = /images)
module.exports = async (inputPath) => {
    const outputPath = inputPath.replace (/\.(jpg|jpeg|png)$/i, '.webp'); //convertit format webp

await sharp (inputPath) // charge img d'origine
    .resize ({
        width : 800, //assez grand pour avoir une résolution correct
        height : 1000,
        fit : "contain", // évite de déformer img
        background: { r: 255, g: 255, b: 255, alpha: 1 } //avoir un fond blanc sur les img
    })
    .toFormat ('webp', {quality:95}) //modifie format et la qualité
    .toFile(outputPath); //enregistre la nouvelle img

    //supp img d'origine ap 10 sec
    setTimeout(async () => {
    try {
        await fs.unlink(inputPath); //supp le fichier original
        console.log("Image originale supprimée après délai");
    } catch (error) {
        console.log("Erreur suppression image originale :", error);
    }
}, 10000);

    return outputPath; //renvoie le chemin de l'img format webp
};