const User = require('../modal/users');

const firebase = require("firebase-admin");

const db = firebase.database();


exports.getRegistration = (req, res, next) => {
    res.render('register');
};

exports.postRegistration = (req, res, next) => {
    const newUser = new User(req.body.name, req.body.dob, req.body.phone, req.body.email, req.body.pswd);
    newUser.addUser()
        .then(() => {
            res.redirect('/');
        }).catch((err) => {
            console.log(err);
        });
};

exports.getLogin = (req, res, next) => {
    res.render('login');
};

exports.postLogin = (req, res, next) => {
    const ref = db.ref('users');
    ref.on('value', (data) => {
        const allData = data.val();
        const keys = Object.keys(allData);
        var id;
        keys.forEach(ele => {
            if (allData[ele].emailId === req.body.email && allData[ele].password === req.body.pwd) {
                id = allData[ele].id;
            }
        });
        if (id) {
            res.redirect(`/budget/${id}/add`);
        } else {
            res.redirect('/');
        }
    });
};

exports.openBudget = (req, res, next) => {
    res.render('budget', { userId: req.params.userId });
};

exports.addBudget = (req, res, next) => {
    User.addBudget(req.body.id, req.body.type, req.body.description, req.body.date, req.body.amt);
    res.redirect(`/budget/${req.body.id}/passbook`);
}

exports.openPassbook = (req, res, next) => {
    const ref = db.ref(`budgets/${req.params.userId}`);
    ref.once('value', (data) => {
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
    //User.deleteBudget(req.params.userId, req.params.budgetId);
    const ref = db.ref(`budgets/${req.params.userId}`);
    ref.once("value", (data) => {
        const allData = data.val();
        return db.ref(`budgets/${req.params.userId}/${req.params.budgetId}`).remove();
    }).then(() => {

        res.redirect(`/budget/${req.params.userId}/passbook`);
    });
}