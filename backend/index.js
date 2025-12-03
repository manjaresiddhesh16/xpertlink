const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');
const ProductRouter = require('./Routes/ProductRouter');
const ExpertRouter = require('./Routes/ExpertRouter'); 
const SessionRouter = require('./Routes/SessionRouter');


require('dotenv').config();
require('./Models/db');

const PORT = process.env.PORT || 8080;

// ✅ CORS before routes
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.options('*', cors());


app.use(bodyParser.json());

app.get('/ping', (req, res) => {
  res.send('PONG');
});



app.use('/auth', AuthRouter);
app.use('/products', ProductRouter);
app.use('/experts', ExpertRouter); // if using experts
app.use('/sessions', SessionRouter);


app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
