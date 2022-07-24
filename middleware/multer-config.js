const multer = require("multer");

const MIME_TYPES = {//structure pour extraire les extensions des fichiers images
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "images");//le dossier images qui va stocker les images uploadées 
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(" ").join("_");//remplacement des espaces par des underscores
        const extension = MIME_TYPES[file.mimetype];//extraire l'extension 
        callback(null, name + Date.now() + "." + extension);//insertion de l'horodatage actuel dans le nom du fichier 
    },
});

module.exports = multer({ storage: storage }).single("image");//l'image uploadée doit s'appeler "image" sur le frontend
