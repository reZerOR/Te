const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000



// middle ware 
app.use(cors())
app.use(express.json())





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o4gj9vp.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();

    // database collections 
    const brandCollection = client.db('brandShopDB').collection('brands');
    const productCollection = client.db('brandShopDB').collection('products')




    // read opration of 6 brands
    app.get('/brands', async(req, res)=>{
        const cursor = brandCollection.find()
        const result = await cursor.toArray()
        res.send(result);
    })

    // find oparation for just one brand
    app.get('/brands/:name', async(req, res)=>{
      const name = req.params.name
      const query = {brand_name: name}
      const result = await brandCollection.findOne(query)
      res.send(result)

    })

    app.get('/products/:name', async(req, res)=> {
      const name = req.params.name;
      console.log(name)
      const query = {brand_name: name}
      const cursor = productCollection.find(query)
      const result = await cursor.toArray()
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




// server 
app.get('/', (req, res)=> {
    res.send("brand shop server is running")
})


app.listen(port, ()=>{
    console.log(`brand shop is running on: ${port} `)
})
