import { Request, Response } from "express";
import * as firebase from "firebase";
const dbconfig = require("../../fbconfig.js");
export default !firebase.apps.length ? firebase.initializeApp(dbconfig) : firebase.app();
const timelines = firebase.database();
const auth = firebase.auth();

export let index = (req: Request, res: Response) => {
  const curruser = auth.currentUser;
  let islogin: boolean = false;
  if (curruser) islogin = true;
  res.render("user/subscribe", {
    added: undefined, users: undefined, islogin: islogin
  });
};

export let finduser = (req: Request, res: Response) => {
    if (!auth.currentUser) {
        console.log("You have not logged");
        res.redirect("/login");
    }

    const target = req.body.nickname;

    console.log(target);

    const curruser = auth.currentUser;
    const found: object[] = [];

    timelines.ref("/users/").once("value", (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            if (childSnapshot.val().nickname == target) {
                console.log("Target found");
                found.push(childSnapshot.val());
            }
        });
        console.log(found);
        res.render("user/subscribe", {added: undefined, users: found, islogin: true});
    });
    // example rendering code <%= name %>, inner code <% %>

};

export let subscribe = (req: Request, res: Response) => {
    const addTarget = req.body.uid;

    timelines.ref("/users/" + auth.currentUser.uid).once("value", (snapshot) => {
        if (snapshot.val().subscribe == "" || snapshot.val().subscribe === undefined || snapshot.val().subscribe === {}) {
            timelines.ref("/users/" + auth.currentUser.uid + "/subscribe").set({
                [addTarget]: true
            });
        } else {
            const dbaccess = timelines.ref("/users/" + auth.currentUser.uid + "/subscribe");
            dbaccess.update({[addTarget]: true});
        }

        res.render("user/subscribe", {added: true, users: undefined, islogin: true});
    });
};
