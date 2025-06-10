const sharp = require ("sharp");
const fs = require ('fs').promises;

module.exports = async (inputPath) => {
    const outputPath = inputPath.replace (/\.(jpg|jpeg|png)$/i, '.webp');

await sharp (inputPath)
    .resize ({
        width : 400,
        height : 500,
        fit : "cover", // évite de déformer img
    })
    .toFormat ('webp')
    .toFile(outputPath);

    setTimeout(() => {
        fs.unlink(inputPath, (error) => {
            if (error) {
                console.log("erreur suppression image originale : ", error);
            } else {
                console.log("Image originale supprimée après délai");
            }
        });
    }, 5000); // délai de 5000 ms = 5 secondes

    return outputPath;
};