const express = require('express');
const cors = require('cors');
const bodParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodParser.json());

app.get('/', (req, res)=>{
    res.send("This is Volunteer Network Server")
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4zcwe.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });


client.connect(err => {
  const collection = client.db(`${process.env.DB_NAME}`).collection("events");

app.post('/addEvent', (req, res)=>{
    const participation = req.body;

    collection.insertOne(participation)
    .then((result)=>{
        res.send(result.insertedCount > 0)
    })
})


app.get('/activity', (req, res)=>{
    const email = req.query.username;
    collection.find({username: email}).toArray((err,documents)=>{
        res.send(documents)
    })
})

// new admin api 
app.get('/adminList', (req, res)=>{
    collection.find().toArray((err,documents)=>{
        res.send(documents)
    })
})

app.delete('/delete/:id', (req, res)=>{
    collection.deleteOne({_id: ObjectId(req.params.id)})
    .then((result)=>{
      res.send(result.deletedCount> 0)
         console.log(result)
    })
  })


//   client.close();
});




app.listen(process.env.PORT || 5000)


