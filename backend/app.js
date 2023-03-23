const express=require("express");
const cors=require("cors");
const morgan= require("morgan");
const path=require("path");

let propertiesReader=require("properties-reader");
const app=express();
app.use(cors());
app.use(morgan("short"));
app.use(express.json());
app.get('/collections',function (req,res,next){
   
    console.log("working");
});
const port=process.env.PORT || 3000;
app.listen(port,function(){
    console.log("App started on port: "+port);
})

app.get("/api/:collection?/:id?", async function (req, res) {
    const { collection, id } = req.params;

    if (!collection & !id) res.send('Incomplete.! Which API you are calling? Hint: orders, lessons, users');
    else if (!id) {

        coll = db.collection(collection);

        const coll_obj = await coll.find({}).toArray();
        res.send(coll_obj);

    } else {
        const ObjectId = require('mongodb').ObjectId;

        try {
            const mongodb_id = new ObjectId(id);  
            coll = db.collection(collection);

            const coll_obj = await coll.find({ _id: mongodb_id }).toArray();

            res.send(coll_obj);
        } catch (error) {
            res.send("Invalid Request string");
        }
    }
});



app.route("/:resource/:id?")
  .post(async (req, res) => {
    const { resource } = req.params;
    let collection = db.collection(resource);
    const item = req.body;
    await collection.insertOne(item);
    res.send(item);
  })
  .put(async (req, res) => {
    const { resource, id } = req.params;
    let collection = db.collection(resource);
    const item = req.body;
    await collection.updateOne({ id: parseInt(id) }, { $set: item });
    res.send(item);
  })
  .delete(async (req, res) => {
    const { resource, id } = req.params;
    let collection = db.collection(resource);
    await collection.deleteOne({ id: parseInt(id) });
    res.send({ id });
  });

app.get("/api/find/:collection?/:key?", async function (req, res) {
    const { collection, key } = req.params;

    if (!collection) res.send("Filter Keys not defined");
    else if (collection & !key) { 
        res.send("Filter Keys not defined"); 
    }
    else {
        coll = db.collection(collection);

        const coll_obj = await coll.find({}).toArray();
        const filtered_coll_obj = coll_obj.filter(doc => doc.name.toLowerCase().includes(key.toLowerCase()));

        res.send(filtered_coll_obj);
    }
});


app.get("/api/sort/:collection?/:key?/:order?", async function (req, res) {

    const { collection, key, order } = req.params;
    coll = db.collection(collection);


    if (!collection && !key) res.send("Sorting not prpper");
    else if (!key) res.send("Filter Keys not defined");
    else if (!order) {
        const coll_obj = await coll.find({}).sort({ [key]: 1 }).toArray();
        res.send(coll_obj);
    }
    else if (order === "1") {
        const coll_obj = await coll.find({}).sort({ [key]: 1 }).toArray();
        res.send(coll_obj);
    }
    else if (order === "-1") {
        const coll_obj = await coll.find({}).sort({ [key]: -1 }).toArray();
        res.send(coll_obj);
    }

});


let nextId = 1;

app.post("/api/:collection?", async function (req, res) {

    const ObjectId = require('mongodb').ObjectId;
    const coll_obj = {
        _id: new ObjectId(),
        ...req.body,
        id: nextId
    };

    const { collection } = req.params;

    let coll = db.collection(collection);

    await coll.insertOne(coll_obj);

    res.send(coll_obj);

});
