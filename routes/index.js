var express = require('express');
var router = express.Router();
var getItems = require('../database').getItems;

/* GET home page. */
router.get('/', function(req, res, next) {
    getItems((items) => {
        res.render('index', { title: 'Shop with GraphQL', items: items});
    });
});

module.exports = router;