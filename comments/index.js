const express = require('express')
const {randomBytes}  = require('crypto')
const bodyParser = require('body-parser')
const cors = require('cors');
const axios = require('axios')
const app = express()

const port = process.env.PORT || 4001;

//Support parsing of application /json type post data
app.use(bodyParser.json());
app.use(cors())
const commentsByPostID = {
}

app.get('/posts/:id/comments', (req, res)=>{
    res.send(commentsByPostID[req.params.id] || [])
});

app.post('/posts/:id/comments', async (req, res)=>{
   
    const commentID = randomBytes(4).toString('hex');
    const contents = req.body.contents;
    const comments = commentsByPostID[req.params.id] || [];
    comments.push({id:commentID, contents, status:'pending'})
    
    await axios.post('http://localhost:4005/events', {
        type:"CommentCreated",
        data : {
            id : commentID,
            contents, 
            postId : req.params.id,
            status:'pending'
        }
    })
    commentsByPostID[req.params.id]  = comments
    res.status(201).send(comments);
});

app.post('/events', async (req, res)=> {
    console.log("Recevied event", req.body)

    const {type, data} = req.body;
    if(type==='CommentModerated') {
        console.log("commentModerated Received")
        const {postId, status, id, contents} = data;
        const comments = commentsByPostID[postId]
        const comment = comments.find((comment)=>{
            return comment.id == id;
        })
        comment.status = status;

        await axios.post('http://localhost:4005/events', {
            type:"CommentUpdated",
            data :{
                id, contents, status,postId
            }
        })
    }
    res.send({});
})
app.listen(port, ()=>{
    console.log("running comment server at port : "+port)
})