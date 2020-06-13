const express = require('express')
const {randomBytes}  = require('crypto')
const bodyParser = require('body-parser')
const app = express()

const port = process.env.PORT || 4000;

//Support parsing of application /json type post data
app.use(bodyParser.json());

const posts = {};

app.get('/posts', (req, res)=>{
    res.send(posts);
})
app.post('/posts', (req, res)=>{
    const id = randomBytes(4).toString('hex')
    const {title} = req.body
    posts[id]={id, title};
    res.status(201).send(posts[id])
})

app.listen(port, ()=>{
    console.log("post server is running...at port : " + port)
});