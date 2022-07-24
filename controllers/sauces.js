const fs = require("fs");//bibliothèque pour gérer les fichiers sur le serveur (file system)

const Sauce = require("../models/sauce");

exports.createSauce = (req, res, next) => {//création d'une nouvelle sauce
    console.log("creation sauce");
    console.log(req.body);
    const sauceObject = JSON.parse(req.body.sauce);//Le frontend envoie les données sous format de chaine de caractères, on les convertit en objet
    delete sauceObject._id;//Pour laisser MongoDB créer l'identificateur lui-même 
    const sauce = new Sauce({
        ...sauceObject,
        likes: 0,
        dislikes: 0,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
        }`,
    });
    sauce
        .save()//sauvagarder la nvelle sauce sur MongoDb 
        .then(() => res.status(201).json({ message: "Objet enregistré !" }))
        .catch((error) => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res) => {//afficher une sauce
    Sauce.findOne({
        _id: req.params.id,
    })
        .then((sauce) => {
            res.status(200).json(sauce);//retourne les informations de la sauce trouvée
        })
        .catch((error) => {
            res.status(404).json({//si la sauce est introuvable on retourne un code 404
                error: error,
            });
        });
};

exports.modifySauce = (req, res) => {
    const sauceObject = req.file
        ? {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${
                req.file.filename
            }`,
        }
        : { ...req.body };
        //operateur ternaire(condition ? valeur si vrai : valeur si faux)
        if (req.auth.userId !== sauceObject.userId) {//vérifier que l'utilisateur authentifié  est bien celui qui a créé la sauce 
            return res
                .status(403)
                .json({ error: "opération non autorisée" });
        }
    Sauce.updateOne(
        { _id: req.params.id },
        { ...sauceObject, _id: req.params.id }
    )
        .then(() => res.status(200).json({ message: "Objet modifié !" }))
        .catch((error) => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (req.auth.userId !== sauce.userId) {
                return res
                    .status(403)
                    .json({ error: "opération non autorisée" });
            }
            const filename = sauce.imageUrl.split("/images/")[1];

            fs.unlink(`images/${filename}`, () => {//supprimer l'image de la sauce à supprimer
                
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() =>
                        res.status(200).json({ message: "Objet supprimé !" })
                    )
                    .catch((error) => res.status(400).json({ error }));
            });
        })
        .catch((error) => res.status(500).json({ error }));
};

exports.getAllSauces =  (req, res) => {//Affiche toutes les sauces
    Sauce.find()
        .then((sauces) => {
            res.status(200).json(sauces);
        })
        .catch((error) => {
            res.status(400).json({
                error: error,
            });
        });
};
exports.like = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            switch (req.body.like) {
                case 1:
                    let compteurLikes = sauce.likes || 0;
                    compteurLikes++;
                    let users = sauce.usersLiked || [];//si le tableau des utilsateurs qui ont likés n'existe pas on l'initialise avec un tableau vide
                    users.push(req.body.userId);//ajouter l'utilisateur en cours aux utilisateurs qui ont likés
                    Sauce.updateOne(//mise à jour de la sauce en cours
                        { _id: req.params.id },
                        { likes: compteurLikes, usersLiked: users }
                    )
                        .then(() => {
                            console.log("liké");
                            res.status(200).json({ message: "liké ok !" });
                        })

                        .catch((error) => {
                            console.log(error);
                            res.status(400).json({
                                error: error,
                            });
                        });
                    break;
                case -1:
                    let compteurDislikes = sauce.dislikes || 0;
                    compteurDislikes++;
                    let users2 = sauce.usersDisliked || [];
                    users2.push(req.body.userId);
                    Sauce.updateOne(
                        { _id: req.params.id },
                        { dislikes: compteurDislikes, usersDisliked: users2 }
                    )
                        .then(() => {
                            console.log("disliké");
                            res.status(200).json({ message: "disliké ok !" });
                        })

                        .catch((error) => {
                            res.status(400).json({
                                error: error,
                            });
                        });
                    break;
                default://la valeur 0, l'utilisateur retire un like ou retire un dislike
                    if (sauce.usersLiked.includes(req.body.userId)) {//vérification si l'utilisateur existae dans le tablea des utilisateur qui ont liké
                        let compteurLikes = sauce.likes || 0;
                        compteurLikes--;//on décrémente le nbre des likes
                        let users = sauce.usersLiked || [];
                        users = users.filter((uId) => uId != req.body.userId);//retirer l'utilisateur du tableau des utilisateurs qui ont liké
                        Sauce.updateOne(//mise à jour de la sauce en cours
                            { _id: req.params.id },
                            { likes: compteurLikes, usersLiked: users }
                        )
                            .then(() => {
                                console.log("retrait du like");
                                res.status(200).json({
                                    message: "retrait du like ok !",
                                });
                            })

                            .catch((error) => {
                                console.log(error);
                                res.status(400).json({
                                    error: error,
                                });
                            });
                    } else {
                        let compteurDislikes = sauce.dislikes || 0;
                        compteurDislikes--;//dédrémentation du compteur des dislikes
                        let users2 = sauce.usersDisliked || [];
                        users2 = users2.filter(
                            (u2Id) => u2Id != req.body.userId
                        );
                        Sauce.updateOne(
                            { _id: req.params.id },
                            {
                                dislikes: compteurDislikes,
                                usersDisliked: users2,
                            }
                        )
                            .then(() => {
                                console.log("retrait du dislike");
                                res.status(200).json({
                                    message: "retrait du dislike ok !",
                                });
                            })

                            .catch((error) => {
                                res.status(400).json({
                                    error: error,
                                });
                            });
                    }
                    break;
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(400).json({
                error: error,
            });
        });
};
