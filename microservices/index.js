const express = require('express');
const app = express();
const morgan = require('morgan');

app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
    for(let i=0; i<10000000; i++){
        
    }
    res.send('Hello world');
})

app.listen(3000, ()=>{
    console.log("Started at 4000");
})