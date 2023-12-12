require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://db_user:DsRMpRLKlvp3DWCz@cluster0.glcj3l3.mongodb.net/iphoneDB?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
    }
}
run().catch(console.dir);

const productsCollection = client.db('iphoneDB').collection('iphone');
const cartsCollection = client.db('cartsDB').collection('cart')
const reviewCollection = client.db('cartsDB').collection('reviews');

// products
app.post('/products', async (req, res) => {
    const product = req.body;
    const result = await productsCollection.insertOne(product);
    res.send(result);
})

app.get('/products', async (req, res) => {
    const result = await productsCollection.find().toArray();
    res.send(result)
})

app.get('/products/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await productsCollection.findOne(query);
    res.send(result);
})

app.put('/products/:id', async (req, res) => {
    const id = req.params.id;
    const product = req.body;
    const filter = { _id: new ObjectId(id) };
    const options = { upsert: true };
    const updateProduct = {
        $set: {
            name: product.name,
            photo: product.photo,
            brand: product.brand,
            price: product.price,
            category: product.category,
            description: product.description,
            rating: product.rating,
        }
    }
    const result = await productsCollection.updateOne(filter, updateProduct, options);
    res.send(result);
    console.log(product.category, result);
})

// carts
app.post('/carts', async (req, res) => {
    const cart = req.body;
    const result = await cartsCollection.insertOne(cart);
    res.send(result);
})

app.get('/carts', async (req, res) => {
    const result = await cartsCollection.find().toArray();
    res.send(result);
})

app.delete('/carts/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await cartsCollection.deleteOne(query);
    res.send(result);
})

app.post("/reviews", async (req, res) => {
    const review = req?.body;
    const result = await reviewCollection.insertOne(review);
    res.send(result);
})

app.get("/reviews", async (req, res) => {
    const result = await reviewCollection.find().toArray();
    res.send(result);
})


app.get('/', (req, res) => {
    res.send('Server is running')
})

app.listen(port, () => {
    console.log(`port number is ${port}`);
})