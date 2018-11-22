import { Request, Response } from "express";
import express from "express";

// Initialize firebase
import * as firebase from "firebase";
const dbconfig = require("../../fbconfig.js");
export default !firebase.apps.length ? firebase.initializeApp(dbconfig) : firebase.app();
const auth = firebase.auth();

export let index = (req: Request, res: Response) => {
  res.render("user/login", {title: "Home"});
};

export let login = (req: Request, res: Response) => {
    if (!!auth.currentUser) {
        res.redirect("/profile");
    }
  const email = req.body.email;
  const password = req.body.password;
  const promise = auth.signInWithEmailAndPassword(email, password);

  promise.catch(function (error) {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
});

  auth.onAuthStateChanged(function(user) {
      if (user) {
          res.redirect("/profile");
        // User is signed in.
      }
      else {
        // No user is signed in.
      }
  });
};
