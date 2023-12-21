// server.js
import express from 'express'
import mongoose from 'mongoose';
const User = require('./models/User');
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/myapp'); 

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://imadjohar2004:imadjohar4@sever.f9qiixn.mongodb.net/?retryWrites=true&w=majority";

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
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);


app.use(express.json());

app.get('/users', async (req, res) => {
 try {
    const users = await User.find();
    res.status(200).json(users);
 } catch (error) {
    res.status(500).json({ message: error.message });
 }
});

app.post('/users', async (req, res) => {
 const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
 });

 try {
    const newUser = await user.save();
    res.status(201).json(newUser);
 } catch (error) {
    res.status(400).json({ message: error.message });
 }
});

app.put('/users/:id', async (req, res) => {
 try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedUser);
 } catch (error) {
    res.status(400).json({ message: error.message });
 }
});

app.delete('/users/:id', async (req, res) => {
 try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'User deleted successfully' });
 } catch (error) {
    res.status(400).json({ message: error.message });
 }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));