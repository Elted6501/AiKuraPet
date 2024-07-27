import { User } from "./authentication.js";

const helpers = {};

helpers.isLoggedIn = (req, res, next) => {
    if (User !== null) {
        return next();
    }
    return res.redirect('/login');
};

helpers.isNotLoggedIn = (req, res, next) => {
    if (User === null) {  
        return next();
    }
    return res.redirect('/home');
};

export default helpers;