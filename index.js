const express = require('express');
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');


const corsConfig = {
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}
app.use(cors(corsConfig))
app.options("*", cors(corsConfig))
app.use(express.json())
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,authorization")
    next()
})


// const uri=

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9lcnqiw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     // perform actions on the collection object
//     client.close();
// });

async function run() {
    try {
        await client.connect()
        const userCollection = client.db('complain-box').collection('users')


        app.get('/alluser', async (req, res) => {
            const query = {}
            const users = await userCollection.find(query).toArray()
            res.send(users)
        })


        // update user
        app.put('/updateduser', async (req, res) => {
            const email = req.query.email
            const updatedUser = req.body
            const filter = { email: email }
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updatedUser.name,
                    img: updatedUser.img,
                    phone: updatedUser.phone,
                    education: updatedUser.education,
                    address: updatedUser.address,
                },
            };
            const result = await userCollection.updateOne(filter, updateDoc, options)
            res.send(result)
        })

        //
        app.get('/user', async (req, res) => {
            const email = req.query.email
            const query = { email: email }
            const result = await userCollection.findOne(query)
            res.send(result)
        })

    }
    finally {

    }
}
run().catch(console.dir)




app.get('/', (req, res) => {
    res.send("Hello from complain box")
})
app.listen(port, () => {
    console.log("Complain box is running on", port);
})

