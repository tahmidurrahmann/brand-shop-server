const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5002;
const app = express();

app.use(cors());
app.use(express.json());
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_KEY}:${process.env.DB_pass}@cluster0.glcj3l3.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)

        const productsCollection = client.db('iphoneDB').collection('iphone');


        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await productsCollection.insertOne(product);
            res.send(result);
        })

        app.get('/products', async (req, res) => {
            // const brands = req.params.brandName; {brand: brands} /:brandName
            const result = await productsCollection.find().toArray();
            res.send(result)
        })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Server is running')
})

app.listen(port, () => {
    console.log(`port number is ${port}`);
})