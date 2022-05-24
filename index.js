const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5losn.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function ran() {
    try {
        await client.connect();
        const partsCollection = client.db('computer_parts').collection('parts');
        const purchaseOrderCollection = client.db('computer_parts').collection('orders');
        const reviewCollection = client.db('computer_parts').collection('review');

        app.get('/parts', async (req, res) => {
            const parts = await partsCollection.find().toArray();
            res.send(parts);
        })

        app.get('/part/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await partsCollection.findOne(filter);
            res.send(result);
        })


        app.post('/orders', async (req, res) => {
            const orders = req.body;
            const result = await purchaseOrderCollection.insertOne(orders);
            res.send(result);
        })

        app.get('/orders', async(req,res) => {
            const email = req.query.email;
            const query = {email: email}
            const orders = await purchaseOrderCollection.find(query).   toArray();
            res.send(orders);
        } )

        app.post('/review', async(req,res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })

        app.get('/review', async(req,res) => {
            const allReviews = await reviewCollection.find().toArray();
            res.send(allReviews);
        })
    }
    finally { }
}

ran().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Hello parts')
})

app.listen(port, () => {
    console.log('Listening port', port);
})
