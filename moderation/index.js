const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

app.post('/events', async (req, res) => {
  const { type, data } = req.body;

  if (type === 'CommentCreated') {
    const status = data.content.includes('orange') ? 'rejected' : 'approved';

    const newComment = {
      ...data,
      status,
    };

    await axios.post('http://event-bus-srv:4005/events', {
      type: 'CommentModerated',
      data: newComment,
    });
  }

  res.send({});
});

app.listen(4003, () => {
  console.log('Listening on 4003 (moderation)');
});
