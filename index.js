const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0p7gq.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();

app.use(bodyParser.json());
app.use(cors());

const port = 5000;

app.get('/', (req, res) => {
    res.send('hello from db, its working')
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const appointmentCollection = client.db("doctorsPortal").collection("Appointments");
  
    app.post('/addAppointment', (req, res) => {
        const appointment = req.body;
        appointmentCollection.insertOne(appointment)
        .then(result => {
            res.send(result.insertedCount > 0)
        })

    })

    app.post('/appointmentByDate', (req, res) => {
        const date = req.body;
        appointmentCollection.find({date: date.date})
        .toArray((err, documents) => {
            res.send(documents);
        })

    })

    app.get('/appointments', (req, res) => {
        appointmentCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })

    })  

});

app.listen(process.env.PORT || port)