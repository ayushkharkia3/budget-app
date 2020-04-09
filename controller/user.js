const User = require('../modal/users');

exports.getRegistration = (req, res, next) => {
    res.render('register');
};

exports.postRegistration = (req, res, next) => {
    const newUser = new User(req.body.name, req.body.dob, req.body.phone, req.body.email, req.body.pswd);
    newUser.addUser();
    res.redirect('/');
};

exports.getLogin = (req, res, next) => {
    res.render('login');
};

exports.postLogin = (req, res, next) => {
    User.searchUser(req.body.email, user => {
        if (!user) {
            res.redirect('/');
        } else {
            if (user.password === req.body.pwd) {
                res.redirect(`/budget/${user.id}/add`);
            } else {
                res.redirect('/');
            }
        }
    })
};

exports.openBudget = (req, res, next) => {
    res.render('budget', { userId: req.params.userId });
};

exports.addBudget = (req, res, next) => {
    User.addBudget(req.body.id, req.body.type, req.body.description, req.body.date, req.body.amt)
    res.redirect(`/budget/${req.body.id}/passbook`);
}

exports.openPassbook = (req, res, next) => {
    User.displayBudget(req.params.userId, user => {
        if (!user) {
            res.redirect('/');
        } else {
            res.render('passbook', {
                userId: req.params.userId,
                budget: user.budget,
                income: user.income,
                expense: user.expense,
                total: user.total,
                length: user.budget.length -1
            });
        }
    });
};

exports.deleteItem = (req,res,next)=>{
    console.log(req.body , req.params);
    User.deleteBudget(req.params.userId , req.params.budgetId);
    res.redirect(`/budget/${req.params.userId}/passbook`)
}