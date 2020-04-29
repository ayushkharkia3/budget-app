const User = require('../modal/users');
const Budget = require('../modal/budget');

const firebase = require("firebase-admin");

const serviceAccount = require("../serviceAccountKey.json");


firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://budget-app-f6630.firebaseio.com"
});

const db = firebase.database();

exports.getRegistration = (req, res, next) => {
    res.render('register');
};

exports.postRegistration = (req, res, next) => {
    const newUser = new User(req.body.name, req.body.dob, req.body.phone, req.body.email, req.body.pswd);
    const ref = db.ref(`users/${newUser.id}`);
    ref.set(newUser)
        .then(() => {
            res.redirect(`/budget/${newUser.id}/add`);
        }).catch((err) => {
            console.log(err);
        });
};

exports.getLogin = (req, res, next) => {
    res.render('login', { notExists: false });
};

exports.postLogin = (req, res, next) => {
    const ref = db.ref('users');
    ref.once('value')
        .then((data) => {
            const allData = data.val();
            const keys = Object.keys(allData);
            var id;
            keys.forEach(e => {
                if ((allData[e].emailId.toUpperCase() === req.body.email.toUpperCase()) && (allData[e].password === req.body.pwd)) {
                    return id = allData[e].id;
                }
            })
            if (id) {
                res.redirect(`/budget/${id}/add`);
            } else {
                res.render("login", { notExists: true });
            }
        }).catch(err => {
            console.log(err);
        });
};

exports.openBudget = (req, res, next) => {
    res.render('budget', { userId: req.params.userId });
};

exports.addBudget = (req, res, next) => {
    const newBudget = new Budget(req.body.type, req.body.description, req.body.date, req.body.amt);
    const ref = db.ref(`budgets/${req.body.id}`)
    ref.push(newBudget)
        .then(() => {
            res.redirect(`/budget/${req.body.id}/passbook`);
        }).catch(() => {
            console.log(err)
        })
}

exports.openPassbook = (req, res, next) => {
    const ref = db.ref(`budgets/${req.params.userId}`);
    ref.once('value')
        .then((data) => {
            const allData = data.val();
            let inc = 0,
                exp = 0;
            if (allData) {
                const budget = [];
                const keys = Object.keys(allData);
                keys.forEach(e => {
                    if (allData[e].type === 'inc') {
                        inc += parseInt(allData[e].amount);
                    } else {
                        exp += parseInt(allData[e].amount);
                    }
                    budget.push({
                        id: e,
                        type: allData[e].type,
                        amount: allData[e].amount,
                        date: allData[e].date,
                        description: allData[e].description,
                    });
                });
                res.render('passbook', {
                    budget: budget,
                    income: inc,
                    expense: exp,
                    total: (inc - exp),
                    userId: req.params.userId,
                    length: budget.length - 1,
                })
            } else {
                res.render('no-money', { userId: req.params.userId })
            }
        });
};

exports.deleteItem = (req, res, next) => {
    const ref = db.ref(`budgets/${req.params.userId}`);
    ref.once("value").then((data) => {
            const allData = data.val();
            db.ref(`budgets/${req.params.userId}/${req.params.budgetId}`).remove()
        })
        .then(() => {
            res.redirect(`/budget/${req.params.userId}/passbook`);
        }).catch(err => {
            console.log(err)
        });
}