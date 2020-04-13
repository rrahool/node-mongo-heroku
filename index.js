const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()


app.use(cors())
app.use(bodyParser.json())

// database user's credentials
const uri = process.env.DB_PATH;


let client = new MongoClient(uri, { useNewUrlParser: true });
const users = ['Shabnoor', 'Popy', 'Mahi', 'Porimoni', 'Shabana'];


// get food data
app.get('/products', function (req, res) {
    client = new MongoClient(uri, { useNewUrlParser: true });
    // read data from database
    client.connect(err => {
        const collection = client.db("onlineShop").collection("products");
        collection.find().toArray((err, documents) =>{
            if(err){
                console.log(err);
                res.status(500).send({message: err});
            }
            else{
                res.send(documents);
            }
        })
        client.close();
    });
})

app.get('/fruits/banana', (req, res) => {
    res.send({fruit: 'Banana', quantity: 1000, price: 10000});
})

app.get('/products/:key', (req, res) => {
    
    const key = req.params.key;

    client = new MongoClient(uri, { useNewUrlParser: true });
    // read data from database
    client.connect(err => {
        const collection = client.db("onlineShop").collection("products");
        collection.find({key}).toArray((err, documents) =>{
            if(err){
                console.log(err);
                res.status(500).send({message: err});
            }
            else{
                res.send(documents[0]);
            }
        })
        client.close();
    });    
});

app.post('/getProductsByKey', (req, res) => {
    
    const key = req.params.key;
    const productKeys = req.body;
    console.log(productKeys);
    

    client = new MongoClient(uri, { useNewUrlParser: true });
    // read data from database
    client.connect(err => {
        const collection = client.db("onlineShop").collection("products");
        collection.find({key: { $in: productKeys }}).toArray((err, documents) =>{
            if(err){
                console.log(err);
                res.status(500).send({message: err});
            }
            else{
                res.send(documents);
            }
        })
        client.close();
    });    
});

// update
// delete

// post food data
app.post('/addProduct', (req, res) => {
    // console.log('data recieved', req.body);
    const product = req.body;
    console.log(product);   

    // save data to database
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("onlineShop").collection("products");
        collection.insert(product, (err, result) =>{
            // console.log("Data Successfully Inserted to Cloud DB", result);
            if(err){
                console.log(err);
                res.status(500).send({message: err});
            }
            else{
                res.send(result.ops[0]);
            }
            
        })
        client.close();
    });
})

// place order
app.post('/placeOrder', (req, res) => {
    // console.log('data recieved', req.body);
    const orderDetails = req.body;
    orderDetails.orderTime = new Date();
    console.log(orderDetails);
    

    // save data to database
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("onlineShop").collection("orders");
        collection.insert(orderDetails, (err, result) =>{
            // console.log("Data Successfully Inserted to Cloud DB", result);
            if(err){
                console.log(err);
                res.status(500).send({message: err});
            }
            else{
                res.send(result.ops[0]);
            }
            
        })
        client.close();
    });
})


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('Listening to port 4000'))