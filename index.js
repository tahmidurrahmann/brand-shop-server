require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5002;
const app = express();

app.use(cors());
app.use(express.json());

// const uri = `mongodb+srv://${process.env.DB_KEY}:${process.env.DB_pass}@cluster0.glcj3l3.mongodb.net/?retryWrites=true&w=majority`;
const uri = `mongodb+srv://db_user:db_user1234@cluster0.glcj3l3.mongodb.net/iphoneDB?retryWrites=true&w=majority`;

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





        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

const productsCollection = client.db('iphoneDB').collection('iphone');
const cartsCollection = client.db('cartsDB').collection('cart')

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
    console.log(cart);
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


app.get('/', (req, res) => {
    res.send('Server is running')
})

app.listen(port, () => {
    console.log(`port number is ${port}`);
})