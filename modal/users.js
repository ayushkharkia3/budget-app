const express = require('express');

const firebase = require("firebase-admin");

const serviceAccount = require("../serviceAccountKey.json");


firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://budget-app-f6630.firebaseio.com"
});

const db = firebase.database();

module.exports = class User {
    constructor(name, dob, mobileNumber, emailId, password) {
        this.id = Math.random().toString(36).slice(2);
        this.name = name;
        this.dob = dob.substring(8) + '-' + dob.substring(5, 7) + '-' + dob.substring(0, 4);
        this.mobileNumber = mobileNumber;
        this.emailId = emailId;
        this.password = password;
        this.terms = true;
        this.income = 0;
        this.expense = 0;
        this.total = 0;
        this.registeredOn = (new Date()).toString();
    }

    addUser() {
        const ref = db.ref(`users/${this.id}`);
        return ref.set(this);
    }

    static addBudget(id, type, desc, date, amt) {
        const ref1 = db.ref(`budgets/${id}/`);
        ref1.push({
            type: type,
            description: desc,
            date: date.substring(8) + '-' + date.substring(5, 7) + '-' + date.substring(0, 4),
            amount: amt,
            addedOn: (new Date()).toString()
        }, (err) => {
            console.log(err)
        })
    }
}