const sharp = require ("sharp");
const fs = require ('fs').promises;

module.exports = async (inputPath) => {
    const outputPath = inputPath.replace (/\.(jpg|jpeg|png)$/i, '.webp');

await sharp (inputPath)
    .resize ({
        width : 800, //assez grand pour avoir une résolution correct
        height : 1000,
        fit : "contain", // évite de déformer img
        background: { r: 255, g: 255, b: 255, alpha: 1 } //avoir un fond blanc sur les img
    })
    .toFormat ('webp', {quality:95}) //modifie qualité
    .toFile(outputPath);

    setTimeout(async () => {
    try {
        await fs.unlink(inputPath);
        console.log("Image originale supprimée après délai");
    } catch (error) {
        console.log("Erreur suppression image originale :", error);
    }
}, 13000);

    return outputPath;
};