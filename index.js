 const express = require("express");
const cors = require('cors');
const jwt =require('jsonwebtoken')
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
require('dotenv').config()
const port=process.env.PORT || 5000
const app =express()

// middleware
app.use(cors())
app.use(express.json())

function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'unauthorized access' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: 'Forbidden access' });
        }
        console.log('decoded', decoded);
        req.decoded = decoded;
        next();
    })
}


 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6sahv.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
        await client.connect()
        const addedItemCollection = client.db("taskManager").collection("addedItem");

       
        
        //post ADD user Majba
        app.get('/addedItem' , async (req, res)=>{
            const email=req.query.email
            const query={email: email}
            const cursor=addedItemCollection.find(query)
            const addedItems=await cursor.toArray()
            res.send(addedItems)
        })
        
        app.post('/addedItem',async (req, res) => {
            const newAddedItem = req.body;
            const result = await addedItemCollection.insertOne(newAddedItem);
            res.send(result)
        })
        app.delete('/addedItem/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await addedItemCollection.deleteOne(query);
            res.send(result);
        });
    }

    finally {
        /* await client.close(); */
    }
}
run().catch(console.dir)


app.get('/',(req,res)=>{
    res.send('Taks is Updating')
})

app.listen(port,()=>{
    console.log('Taks is Updating on Website',port)
})