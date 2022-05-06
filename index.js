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

// function verifyJWT(req, res, next) {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) {
//         return res.status(401).send({ message: 'unauthorized access' });
//     }
//     const token = authHeader.split(' ')[1];
//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
//         if (err) {
//             return res.status(403).send({ message: 'Forbidden access' });
//         }
//         console.log('decoded', decoded);
//         req.decoded = decoded;
//         next();
//     })
// }


 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oiyjm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
        await client.connect()
        const productCollection = client.db("dreamsvehicle").collection("product");
        const delearCollection = client.db("dreamsvehicle").collection("delear");


        app.get('/items', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);

            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);

            let items;

            if (page || size) 
            {

                items = await cursor.skip(page*size).limit(size).toArray();
            }

            else {
                items = await cursor.toArray();
            }

            res.send(items)
        })


        app.get('/itemsCount', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const count = await productCollection.estimatedDocumentCount();
            res.send({ count })
        })

        app.get("/item/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await productCollection.findOne(query);
            res.send(result);
        })


        app.put("/delivered/:id", async (req, res) => {
            const id = req.params.id;
            const updatedItem = req.body;

            console.log(updatedItem);

            const filter = { _id: ObjectId(id) };

            const options = { upsert: true };

            const updatedDoc = {
                $set: {
                    quantity: updatedItem.quantity,
                    sale: updatedItem.sale
                }
            }

            const result = await productCollection.updateOne(filter, updatedDoc, options);

            res.send(result);

        })
        app.get('/delear',async(req,res)=>{
            const query={}
            const cursor=delearCollection.find(query)
            const delear=await cursor.toArray()
            res.send(delear)
        })

        app.put("/restock/:id", async (req, res) => {
            const id = req.params.id;
            const updatedItem = req.body;


            const filter = { _id: ObjectId(id) };

            const options = { upsert: true };

            const updatedDoc = {
                $set: {
                    Quantity: updatedItem.Quantity
                }
            }

            const result = await productCollection.updateOne(filter, updatedDoc, options);

            res.send(result);

        })

        // app.post("/addnewitem" , async(req,res)=>
        // {
        //     const newItem = req.body;
        //     const result = await productCollection.insertOne(newItem)

        //     res.send(result);
        // })


        // app.post("/deleteitem" , async(req , res)=>
        // {
        //     const id = req.body;

        //     const result = await productCollection.deleteOne({ "_id" : ObjectId(id)})

        //     res.send(result)
        // })
        app.delete('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.deleteOne(query);
            res.send(result);
        });

    }

    finally {
        /* await client.close(); */
    }
}
run().catch(console.dir)


app.get('/',(req,res)=>{
    res.send('Products is Updating and waiting for New Arrival Products')
})

app.listen(port,()=>{
    console.log('Products is Updating on Website',port)
})