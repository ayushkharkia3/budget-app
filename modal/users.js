const express = require('express');
const fs = require('fs');
const path = require('path');

const p = path.join(path.dirname(process.mainModule.filename), 'data', 'users.json');
let i = 0;

const AllEntries = cb => {
    fs.readFile(p, (err, data) => {
        if (!err) {
            cb(JSON.parse(data));
        }
        else {
            cb([]);
        }
    });
};

module.exports = class User {
    constructor(name, dob, mobileNumber, emailId, password) {
        this.id = Math.random().toString(36).slice(2);
        this.name = name;
        this.dob =  dob.substring(8)+'-'+dob.substring(5,7)+'-'+dob.substring(0,4);
        this.mobileNumber = mobileNumber;
        this.emailId = emailId;
        this.password = password;
        this.terms = true;
        this.income = 0;
        this.expense = 0;
        this.total = 0;
        this.registeredOn = new Date();
        this.budget = [];
    }

    addUser() {
        AllEntries(users => {
            users.push(this);
            fs.writeFile(p, JSON.stringify(users), err => {
                console.log(err);
            });
        });
    }

    static searchUser(email, cb) {
        AllEntries(users => {
            const currentUser = users.find(p => (p.emailId).toUpperCase() === email.toUpperCase());
            cb(currentUser);
        });
    }

    static addBudget(id, type, desc, date, amt) {
        let newEntry = {
            "id" : Math.random().toString(36).slice(2)  ,
            "type": type,
            "description": desc,
            "date": date.substring(8)+'-'+date.substring(5,7)+'-'+date.substring(0,4),
            "amount": amt,
            addedOn : new Date()
        }
        AllEntries(users => {
            const currentUser = users.findIndex(p => p.id === id)
            users[currentUser].budget.push(newEntry);
            if(type === 'inc'){
                users[currentUser].income = parseInt(users[currentUser].income) + parseInt(amt);
            } else {
                users[currentUser].expense = parseInt(users[currentUser].expense) + parseInt(amt);
            }
            users[currentUser].total = parseInt(users[currentUser].income) - parseInt(users[currentUser].expense);
            fs.writeFile(p, JSON.stringify(users), err => {
                console.log(err);
            });
        });
    }

    static displayBudget(id, cb){
        AllEntries(users =>{
            const currentUser = users.find(p => p.id === id);
            cb(currentUser);
        })
    }

    static deleteBudget(userId, budgetId){
        AllEntries(users =>{
            const currentUser =  users.findIndex(p => p.id === userId);
            const currenBudget =  users[currentUser].budget.findIndex(p => p.id === budgetId);
            const current = users[currentUser].budget[currenBudget];
            if(current.type === 'inc'){
                users[currentUser].income = parseInt(users[currentUser].income)- parseInt(current.amount); 
            } else {
                users[currentUser].total = parseInt(users[currentUser].income)- parseInt(users[currentUser].expense) ;
                users[currentUser].expense = parseInt(users[currentUser].expense)- parseInt(current.amount);
            }
            users[currentUser].total = parseInt(users[currentUser].income)- parseInt(users[currentUser].expense) ;
            users[currentUser].budget.splice(currenBudget,1);
            fs.writeFile(p,JSON.stringify(users), err =>{
                console.log(err);
            });
        });
    }
}