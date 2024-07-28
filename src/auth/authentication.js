import { Router } from "express";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { db, appfire } from "../firebase.js";

const au = Router();
const auth = getAuth(appfire);

let User = null;

auth.onAuthStateChanged(async user => {
    if (user) {
        User = user;
    } else {
        User = null;
    };
});

au.post('/signup', async (req, res) => {

    await createUserWithEmailAndPassword(auth, req.body.email, req.body.password)
        .then(async (userCredential) => {

            const user = userCredential.user;

            const newUser = {
                uid: user.uid,
                name: req.body.name,
                phone: req.body.phone,
                address: req.body.address,
                email: req.body.email,
                password: req.body.password,
                pets: []
            };

            await db.collection("users").add(newUser);

            res.redirect("/home");

        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage)
            res.redirect("/signin");
        });

});

au.post('/login', async (req, res) => {

    await signInWithEmailAndPassword(auth, req.body.email, req.body.password)
        .then((userCredential) => {

            const user = userCredential.user;

            res.redirect("/home");

        })
        .catch((error) => {

            const errorCode = error.code;
            const errorMessage = error.message;

            res.redirect("/login");
        });

});

au.get('/logout', async (req, res) => {

    await signOut(auth).then(() => {

        res.redirect("/login");

    }).catch((error) => {

        console.log("Error");

        res.redirect("/home")

    });
});

export { au, User };