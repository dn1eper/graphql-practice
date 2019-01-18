var express = require('express');
var router = express.Router();
var graphqlHTTP = require('express-graphql');
var got = require('got');
var { buildSchema } = require('graphql');
var getItems = require('../database').getItems;


// GET home page
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Shop with GraphQL'});
});

// Geting all items using graphQL
router.use('/graphql', graphqlHTTP({
        // GraphQL schema
        schema: buildSchema(`
            type Query { items(currency: String): [Item] }
            type Item {
                id: String,
                title: String,
                image: String
                price: Float,
                description: String,
                currency: String
            }
        `),
        // The resolver
        rootValue: {
            async items(args) {
                let items = await getItems();
                //items = items.map(a => Object.assign({}, a));
                //items = items.map(function(el) {return el.toObject()});
                console.log(args)
                
                let processedItems = changeCurrency(items, args.currency);
                return processedItems;
            }
        },
        graphiql: true
    })
);

async function changeCurrency(origItems, currency) {
    let items = [];
    currency = currency || 'rub';
    
    // Fetching currency from CRB and changing it in response
    let rbcResponse = await got('https://www.cbr-xml-daily.ru/daily_json.js', { json: true });
    let rate;
    if (currency == 'rub') {
        rate = 1;
    } else {
        rate = rbcResponse.body.Valute[currency.toUpperCase()].Value;
    }

    for (let i = 0; i < origItems.length; ++i) {
        items[i] = origItems[i];

        if (currency != 'rub') {
            items[i].price = items[i].price / rate;
        }
        items[i].currency = currency;
        items[i].id = items[i].id || items[i]._id.toString();
    }
    return items;
}

module.exports = router;