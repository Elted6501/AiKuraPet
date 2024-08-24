import { Router } from "express";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs-extra";
import { db } from "../firebase.js";
import { changeEmail, changePass, User } from "../auth/authentication.js";
import helpers from "../auth/helpers.js";

const postes = Router();

postes.post("/add/pet", helpers.isLoggedIn, async (req, res) => {

    const newPet = {
        name: req.body.name,
        age: req.body.age,
        specie: req.body.specie,
        breed: req.body.breed,
        idcollar: req.body.idcollar,
        address: req.body.address,
        image: req.file != undefined ? (await cloudinary.uploader.upload(req.file.path,
            { folder: "AiKuraPet" }
        )).url : cloudinary.url("AiKuraPet/a6am5bef36yq3s13i5rv"),
        iduser: User.uid,
        register: []
    };

    if (req.file != undefined) {
        await fs.unlink(req.file.path);
    }

    let pet = await db.collection("pets").add(newPet);

    let Users = await db.collection("users").get();

    Users.forEach(async (doc) => {

        if (doc.data().uid === User.uid) {
            console.log("entrando");

            let newPets = doc.data().pets;

            newPets.push(pet.id);

            await db.collection("users").doc(doc.id).update({ pets: newPets });
        }
    });

    res.redirect("/home");
});

postes.post("/edit/pet/:id", helpers.isLoggedIn, async (req, res) => {

    const id = req.params.id;

    const pet = await (await db.collection("pets").doc(id).get()).data();

    const newDataPet = {
        name: req.body.name,
        specie: req.body.specie,
        breed: req.body.breed,
        age: req.body.age,
        weight: req.body.weight,
        idcollar: req.body.idcollar,
        address: req.body.address,
        image: req.file != undefined ? (await cloudinary.uploader.upload(req.file.path)).url : pet.image
    };

    if (req.file != undefined) {
        await fs.unlink(req.file.path);
    }

    await db.collection("pets").doc(id).update(newDataPet);

    res.redirect("/home");
});

postes.post("/profile/edit", helpers.isLoggedIn, async (req, res) => {

    const uid = User.uid;

    const user = (await db.collection("users").where("uid", "==", uid).get()).docs[0]

    try {
        await db.collection("users").doc(user.id).update(req.body);
    } catch (error) {
        console.log(error);
    }


    if (req.body.email != user.data().email) {
        changeEmail(req.body.email);
    }

    if (req.body.password != user.data().password) {
        changePass(req.body.password);
    }

    res.redirect("/profile");

});

export default postes;