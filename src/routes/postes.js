import { Router } from "express";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs-extra";
import { db } from "../firebase.js";
import { User } from "../auth/authentication.js";

const postes = Router();

postes.post("/add/pet", async (req, res) => {

    const newPet = {
        name: req.body.name,
        specie: req.body.specie,
        breed: req.body.breed,
        age: req.body.age,
        weight: req.body.weight,
        idcollar: req.body.idcollar,
        address: req.body.address,
        image: (await cloudinary.uploader.upload(req.file.path)).url
    };

    await fs.unlink(req.file.path);

    let pet = await db.collection("pets").add(newPet);

    await db.collection("users").doc(User).update({
        pets: pet.id
    });
    
    res.redirect("/home");
});

postes.post("/edit/pet/:id", async (req, res) => {

    const id = req.params.id;

    const newPet = {
        name: req.body.name,
        specie: req.body.specie,
        breed: req.body.breed,
        age: req.body.age,
        weight: req.body.weight,
        idcollar: req.body.idcollar,
        address: req.body.address,
        image: (await cloudinary.uploader.upload(req.file.path)).url
    };

    await fs.unlink(req.file.path);

    await db.collection("pets").doc().update(newPet);

    res.redirect("/home");
});

postes.post("/profile/edit", async (req, res) => {

    const newUserData = {
        name: req.body.name,
        phone: req.body.phone,
        address: req.body.address,
        email: req.body.email,
        password: req.body.password,
    };

    await db.collection("users").doc().update(newUserData);

    res.redirect("/profile");
});

export default postes;