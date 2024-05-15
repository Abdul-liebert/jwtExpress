const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = require('./Routes/AuthRoutes');
const todoRoute = require('./Routes/TodoRoute');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello World!!');
});

app.use("/api/auth", router)
app.use("/api", todoRoute);

const port = 3000 || process.env.port;

app.listen(port, () => {
    console.log(`Listening to requests at port: ${port}`);
});