const express = require('express');
const cors = require('cors');
// const ObjectId= require('mongodb').ObjectId;
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.slxtz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const appointmentCollection = client.db("doctorsPortal").collection("appointment");

    app.post('/addAppointment', (req, res) => {
        const appointments = req.body;
        console.log(appointments);
        appointmentCollection.insertOne(appointments)
        .then(result=> {
            res.send(result.insertedCount > 0)
        })
    })

    app.post('/appointmentByDate', (req, res) => {
        const date = req.body;
        console.log(date.date);
        appointmentCollection.find({date: date.date})
        .toArray((err, documents)=> {
            res.send(documents);
        })
    })

    app.get('/allAppointments', (req, res) =>{
        appointmentCollection.find({}).limit(15)
        .toArray((err, documents) => {
            res.send(documents);
        })
    })

});

// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/index.html');
// })

const port = 4000;
app.get('/', (req, res)=> {
    res.send("db is working!!");
})
app.listen(process.env.PORT || port);
// app.listen(3000, () => console.log('listening to port 3000'));