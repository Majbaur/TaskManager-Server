const express = require("express");
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
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
        const arrivalProductCollection = client.db("dreamsvehicle").collection("arrivalProduct");
        const delearCollection = client.db("dreamsvehicle").collection("delear");


        app.get('/product',async(req,res)=>{
            const query={}
            const cursor=productsCollection.find(query)
            const products=await cursor.toArray()
            res.send(products)
        })
        
        
    }
    finally{}
}
run().catch(console.dir)


app.get('/',(req,res)=>{
    res.send('Johne is Running and waiting for Ema')
})

app.listen(port,()=>{
    console.log('John is runing on Port',port)
})