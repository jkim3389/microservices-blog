const express = require('express')
const {randomBytes}  = require('crypto')
const bodyParser = require('body-parser')
const app = express()

const port = process.env.PORT || 4001;

//Support parsing of application /json type post data
app.use(bodyParser.json());

const commentsByPostID = {
}
app.get('/posts/:id/comments', (req, res)=>{
    res.send(commentsByPostID[req.params.id] || [])
});

app.post('/posts/:id/comments', (req, res)=>{
    console.log("running? ")
    const commentID = randomBytes(4).toString('hex');
    const contents = req.body.contents;
    const comments = commentsByPostID[req.params.id] || [];
    console.log(`commentID is ${commentID} and contents is ${contents} and comments is ${comments}`)
    comments.push({id:commentID, contents})
    commentsByPostID[req.params.id]  = comments
    res.status(201).send(comments);
});

app.listen(port, ()=>{
    console.log("running comment server at port : "+port)
})