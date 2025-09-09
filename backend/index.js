const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const auth = require('./Routes/auth');
const brands = require('./Routes/brands');
require('dotenv').config();
require('./Models/db');
const PORT = process.env.PORT || 8080;

app.get('/ping', (req, res) => {
    res.send('PONG');
})

app.use(bodyParser.json());
app.use(cors());
app.use('/auth', auth);
app.use('/brands', brands);



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})