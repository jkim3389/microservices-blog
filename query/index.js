const express = require('express')
const cors =require('cors')
const bodyParser = require('body-parser')
const axios = require('axios')
const app = express()

app.use(cors())
app.use(bodyParser.json());

const query = {}

const handleEvent = (type, data)=>{
    if(type === 'PostCreated') {
        query[data.id] = {
            id:data.id,
            title : data.title,
            comments : []
        }
    } 
    if(type==='CommentCreated') {
        const {postId, id, contents, status} = data
        query[postId].comments.push({id, contents, status});
    }
    if(type ==='CommentUpdated') {
        const {id, postId, contents, status} = data;
        const post = query[postId]
        const comment = post.comments.find((comment)=>{return comment.id == id})
        comment.status = status
        comment.contents = contents
    }
}
app.get('/posts', (req, res)=>{
    res.send(query);
})

app.post('/events', (req,res)=>{
    const {type, data} = (req.body)
    
    handleEvent(type, data);

    res.send({})
})
app.listen(4002, async ()=>{
    console.log("listening on 4002")
    const res = await axios.get('http://event-bus-srv:4005/events');
    for(let event of res.data) {
        console.log("processing event", event.type)
        handleEvent(event.type, event.data)
    }
})

