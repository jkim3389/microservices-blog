const express = require('express')
const cors = require('cors');
const {randomBytes}  = require('crypto')
const bodyParser = require('body-parser')
const axios = require('axios')

const app = express()

const port = process.env.PORT || 4000;

//Support parsing of application /json type post data
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res)=>{
    res.send(posts);
})
app.post('/posts/create', async (req, res)=>{
    const id = randomBytes(4).toString('hex')
    const {title} = req.body
    posts[id]={id, title};
    await axios.post('http://event-bus-srv:4005/events', {
        type : "PostCreated", 
        data :{
            id, title
        }
    })
    res.status(201).send(posts[id])
})
app.post('/events', (req, res)=>{
    console.log("Recevied event", req.body)

    res.send({});
})
app.listen(port, ()=>{

    console.log("post server is running...at port : " + port)
});