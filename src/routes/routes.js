import { Router } from "express";
import { db } from "../firebase.js";
import helpers from "../auth/helpers.js";

const routes = Router();

routes.get("/login", helpers.isNotLoggedIn, (req, res) => res.render("logInPage"));

routes.get("/signin", helpers.isNotLoggedIn, (req, res) => res.render("SignInPage"));

routes.get("/", (req, res) => res.render("homePage"));

routes.get("/historial/:id", helpers.isLoggedIn, (req, res) => res.render("historial"));

routes.get("/home", helpers.isLoggedIn, async (req, res) => {

    const querySnapshot = await db.collection("pets").get();

    const pets = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    console.log(pets);

    res.render("log", { pets });
});

routes.get("/profile", helpers.isLoggedIn, (req, res) => res.render("profile"));

export default routes;
