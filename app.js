const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/microserviceA', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Microservice A: Connected to MongoDB'));

// User Schema and Model
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    gender: String,
    address: String
});

const User = mongoose.model('User', userSchema);

// Routes
app.post('/users', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Microservice A running on port ${PORT}`));
