const express = require('express');

const usersController = require('../controller/user');

const router = express.Router();

router.get('/register', usersController.getRegistration);

router.get('/', usersController.getLogin);

router.post('/',usersController.postLogin);

router.post('/register', usersController.postRegistration);

router.get('/budget/:userId/add', usersController.openBudget);

router.post('/budget/:userId/add', usersController.addBudget);

router.get('/budget/:userId/passbook', usersController.openPassbook);

router.post('/budget/:userId/delete-item/:budgetId', usersController.deleteItem);

module.exports = router;