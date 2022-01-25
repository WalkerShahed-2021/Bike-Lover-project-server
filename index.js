const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
app.use(express.json());
const cors = require('cors');
require('dotenv').config();
app.use(cors());
app.use(express.json())


const port = process.env.PORT || 5000;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rzrcq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);


async function run (){
     try{
        await client.connect();
        const database = client.db('BikeLover');
        const productCollection = database.collection('products');
        const ManyProductCollection = database.collection('manyProducts');
        const BuyerCollection = database.collection('Buyer');
        const ReviewCollection = database.collection('Review');
        const usersCollection = database.collection('users');

        //get api1
        app.get('/manyProducts', async (req, res) =>{
            const cursor = ManyProductCollection.find({});
            const ManyProduct = await cursor.toArray();
            res.send(ManyProduct);
        })

        
        //get api2
        app.get('/products', async (req, res) =>{
            const cursor = productCollection.find({});
            const product = await cursor.toArray();
            res.send(product);
        })

        //get api3
        app.get('/Buyer', async (req, res) =>{
            const cursor = BuyerCollection.find({});
            const Buyer = await cursor.toArray();
            res.send(Buyer);
        })

        //get api4
        app.get('/Review', async (req, res) =>{
            const cursor = ReviewCollection.find({});
            const Reviews = await cursor.toArray();
            res.send(Reviews);
        })

        //get api5
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const quary = {email: email};
            const user = await usersCollection.findOne(quary)
            let isAdmin = false;
            if(user?.role === 'admin'){
                isAdmin = true;
            }
            res.json({admin: isAdmin});
        })
        
        //post api1
        app.post('/Buyer', async (req, res) =>{
            const newProduct = req.body;
            const result = await BuyerCollection.insertOne(newProduct);
            res.json(result);
        });


        //post api2
        app.post('/Review', async (req, res) =>{
            const Review = req.body;
            const result = await ReviewCollection.insertOne(Review);
            res.json(result);
        });

        //post api3
        app.post('/users', async (req, res) =>{
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result);
        })

        //post api4
        app.post('/manyProducts', async (req, res) =>{
            const AddProduct = req.body;
            const result = await ManyProductCollection.insertOne(AddProduct);
            res.json(result);
        })

        //put api
        app.put('/users', async (req, res) =>{
            const user = req.body;
            const filter = {email: user.email};
            const options = { upsert: true };
            const updateDoc = {$set: true};
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        })

        //put api
        app.put('/users/admin', async (req, res) =>{
            const user = req.body;
            const filter = {email: user.email};
            const updateDoc = {$set: {role: 'admin'}};
            const result = await usersCollection.updateOne(filter, updateDoc, )
            res.json(result)
        })

        //DELETE api 
        app.delete('/Buyer/:id', async (req, res) =>{
            const id = req.params.id;
            const quary = {_id:(id)}
            const result = await BuyerCollection.deleteOne(quary);
            res.json(result);
        })


     }
      finally{
        //  await client.close();
      }
}
run().catch(console.dir);



app.get('/',  (req, res) => {
    res.send('moto-bikes-seles-client-assignments12')
})


app.listen(port, () =>{
    console.log('listing to port');
})
