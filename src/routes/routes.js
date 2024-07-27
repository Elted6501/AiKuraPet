import { Router } from "express";
import helpers from "../auth/helpers.js";

const routes = Router();

routes.get("/login", helpers.isNotLoggedIn, (req, res) => res.render("logInPage"));

routes.get("/signin", helpers.isNotLoggedIn, (req, res) => res.render("SignInPage"));

routes.get("/", (req, res) => res.render("homePage"));

routes.get("/historial", helpers.isLoggedIn, (req, res) => res.render("historial"));

routes.get("/home", helpers.isLoggedIn, (req, res) => res.render("log"));

routes.get("/profile", helpers.isLoggedIn, (req, res) => res.render("profile"));

export default routes;
