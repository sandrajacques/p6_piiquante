const Sauce = require("../models/sauce");
const fs = require("fs");

exports.createSauce = (req, res, next) => {
    console.log("creation sauce");
    console.log(req.body);
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        likes: 0,
        dislikes: 0,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
        }`,
    });
    sauce
        .save()
        .then(() => res.status(201).json({ message: "Objet enregistré !" }))
        .catch((error) => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id,
    })
        .then((sauce) => {
            res.status(200).json(sauce);
        })
        .catch((error) => {
            res.status(404).json({
                error: error,
            });
        });
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file
        ? {
              ...JSON.parse(req.body.sauce),
              imageUrl: `${req.protocol}://${req.get("host")}/images/${
                  req.file.filename
              }`,
          }
        : { ...req.body };
    Sauce.updateOne(
        { _id: req.params.id },
        { ...sauceObject, _id: req.params.id }
    )
        .then(() => res.status(200).json({ message: "Objet modifié !" }))
        .catch((error) => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            const filename = sauce.imageUrl.split("/images/")[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() =>
                        res.status(200).json({ message: "Objet supprimé !" })
                    )
                    .catch((error) => res.status(400).json({ error }));
            });
        })
        .catch((error) => res.status(500).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
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
exports.like = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            switch (req.body.like) {
                case 1:
                    let compteurLikes = sauce.likes || 0;
                    compteurLikes++;
                    let users = sauce.usersLiked || [];
                    users.push(req.body.userId);
                    Sauce.updateOne(
                        { _id: req.params.id },
                        { likes: compteurLikes,usersLiked: users}
                    )
                        .then(() => {
                            console.log("liké ou non");
                            res.status(200).json({ message: "liké !" });
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
                        { dislikes: compteurDislikes,usersDisliked:users2 }
                    )
                        .then(() => {
                            res.status(200).json({ message: "liké !" });
                        })

                        .catch((error) => {
                          res.status(400).json({
                                error: error,
                            });
                        });
                default:
                        if(sauce.usersLiked.includes(req.body.userId)){
                          
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
