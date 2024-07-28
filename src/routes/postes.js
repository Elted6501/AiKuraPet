import { Router } from "express";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs-extra";
import { db } from "../firebase.js";
import { User } from "../auth/authentication.js";
import helpers from "../auth/helpers.js";

const postes = Router();

postes.post("/add/pet", helpers.isLoggedIn, async (req, res) => {

    const newPet = {
        name: req.body.name,
        specie: req.body.specie,
        breed: req.body.breed,
        age: req.body.age,
        weight: req.body.weight,
        idcollar: req.body.idcollar,
        address: req.body.address,
        image: req.file != undefined ? (await cloudinary.uploader.upload(req.file.path)).url : "/img/perrito.png",
        iduser: User.uid
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

    const newDataPet = {
        name: req.body.name,
        specie: req.body.specie,
        breed: req.body.breed,
        age: req.body.age,
        weight: req.body.weight,
        idcollar: req.body.idcollar,
        address: req.body.address,
        image: req.file != undefined ? (await cloudinary.uploader.upload(req.file.path)).url : null
    };

    if (req.file != undefined) {
        await fs.unlink(req.file.path);
    }

    await db.collection("pets").doc(id).update(newDataPet);

    res.redirect("/home");
});

postes.post("/profile/edit", helpers.isLoggedIn, async (req, res) => {

    const newUserData = {
        name: req.body.name,
        phone: req.body.phone,
        address: req.body.address
    };

    let Users = await db.collection("users").get();

    Users.forEach(async (doc) => {

        if (doc.data().uid === User.uid) {
            await db.collection("users").doc(doc.id).update(newUserData);
        }

    });

    res.redirect("/profile");

});

export default postes;