import { Router } from "express";
import { db } from "../firebase.js";
import helpers from "../auth/helpers.js";
import { User } from "../auth/authentication.js";

const routes = Router();

routes.get("/login", helpers.isNotLoggedIn, (req, res) => res.render("logInPage"));

routes.get("/signin", helpers.isNotLoggedIn, (req, res) => res.render("SignInPage"));

routes.get("/", (req, res) => res.render("homePage"));

routes.get("/historial/:id", async (req, res) => {

    const pet = (await db.collection("pets").doc(req.params.id).get()).data();

    res.render("historial", { pet });
});

routes.get("/home", helpers.isLoggedIn, async (req, res) => {

    const uid = User.uid;

    const pets = await db.collection("pets").where("iduser", "==", uid).get();

    const petsData = pets.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    const breedsFetch = await (await fetch('https://dog.ceo/api/breeds/list/all')).json();

    const breeds = Object.keys(breedsFetch.message);

    res.render("home", { petsData, breeds });

});

routes.get("/profile", helpers.isLoggedIn, async (req, res) => {

    const uid = User.uid;

    const user = (await db.collection("users").where("uid", "==", uid).get()).docs[0].data();

    res.render("profile", { user });
});

export default routes;
