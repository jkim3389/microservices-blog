const express = require('express')
const axios = require('axios')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.json())


app.post('/events', async (req, res)=>{
    const {type, data} = req.body
    if(type==='CommentCreated') {

        const status = data.contents.includes('orange') ? 'rejected' : 'approved';
        
        await axios.post('http://localhost:4005/events', {
            type: 'CommentModerated',
            data : {
                id : data.id,
                contents : data.contents, 
                postId : data.postId,
                status
            }
        })
        
    }
    res.send({})
})
app.listen(4003, ()=>{
    console.log('Listening on port 4003')
})