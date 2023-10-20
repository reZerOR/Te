const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    const curtCollection = client.db('brandShopDB').collection('curt')




    // read opration of 6 brands
    app.get('/brands', async(req, res)=>{
        const cursor = brandCollection.find()
        const result = await cursor.toArray()
        res.send(result);
    })

    // brand  find one oparation
    app.get('/brands/:name', async(req, res)=>{
      const name = req.params.name
      const query = {brand_name: name}
      const result = await brandCollection.findOne(query)
      res.send(result)

    })

    // product find many oparation
    app.get('/products/:name', async(req, res)=> {
      const name = req.params.name;
      console.log(name)
      const query = {brand_name: name}
      const cursor = productCollection.find(query)
      const result = await cursor.toArray()
      res.send(result)
    })

    // product find one oparation
    app.get('/productdetails/:id', async(req, res)=>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await productCollection.findOne(query)
      res.send(result)
    })

    // curt read oparation 
    app.get('/curt', async(req, res)=>{
        const cursor = curtCollection.find()
        const result = await cursor.toArray()
        res.send(result);
    })


    // POST oparations


    // curt post oparation
    app.post('/curt', async(req, res)=>{
      const product = req.body
      const result = await curtCollection.insertOne(product)
      console.log(product)
      res.send(result)

    })


    // product post opration
    app.post("/products", async(req, res)=>{
      const product = req.body
      const result = await productCollection.insertOne(product)
      console.log(product)
      res.send(result)
    })


    // delete oparation
      app.delete('/curt/:id', async(req, res) => {
        const id = req.params.id
        console.log(id)
        const query = {_id: new ObjectId(id)}
        const result =await curtCollection.deleteOne(query)
        res.send(result)
    })


    // Put oparations
        app.put('/products/:id', async(req, res)=>{
      const id = req.params.id
      const updateProduct = req.body

      // update database
      const filter = {_id: new ObjectId(id)}
      const option = {upsert: true}
      const product = {
        $set:{
          name: updateProduct.name, 
          brand_name: updateProduct.brand_name,
          price: updateProduct.price,
          rating: updateProduct.rating,
          type: updateProduct.type,
          image: updateProduct.image,
        }
      }
      const result = await productCollection.updateOne(filter, product, option);
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
