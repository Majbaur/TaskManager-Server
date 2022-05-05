const express = require("express");
const cors = require('cors');
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
require('dotenv').config()
const port=process.env.PORT || 5000
const app =express()

// middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oiyjm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
        await client.connect()
        const productsCollection = client.db("dreamsvehicle").collection("product");
        const delearCollection = client.db("dreamsvehicle").collection("delear");


        app.get('/product',async(req,res)=>{
            const query={}
            const cursor=productsCollection.find(query)
            const products=await cursor.toArray()
            res.send(products)
        })
        app.get('/product/:id',async(req,res)=>{
            const id =req.params.id
            const query={_id: ObjectId(id)}
            const product=await productsCollection.findOne(query)
            res.send(product)


        })
        
        app.get('/delear',async(req,res)=>{
            const query={}
            const cursor=delearCollection.find(query)
            const delear=await cursor.toArray()
            res.send(delear)
        })
    }
    finally{}
}
run().catch(console.dir)


app.get('/',(req,res)=>{
    res.send('Products is Updating and waiting for New Arrival Products')
})

app.listen(port,()=>{
    console.log('Products is Updating on Website',port)
})