require('dotenv').config();
const { client, createTables, seed } = require('./db')
const morgan = require('morgan')
const express = require('express');
const router = require('./api')

const app = express();
app.use(express.json());
app.use(morgan('combined'))

const init = async () => {
    await client.connect();
    console.log('db connected')
    await createTables();
    console.log('tables created')
    await seed();
    console.log('data seeded')
 
  
  app.listen(process.env.PORT, () => {console.log(`app listening on ${process.env.PORT}`)})
};


app.use('/api', router)

init();
