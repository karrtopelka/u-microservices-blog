const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: '*',
  }),
);

const posts = {};

const handleEvent = (type, data) => {
  if (type === 'PostCreated') {
    const { id, title } = data;

    posts[id] = { id, title, comments: [] };
  }

  if (type === 'CommentCreated') {
    const { commentId, content, postId, status } = data;

    const post = posts[postId];

    post.comments.push({ commentId, content, status });
  }

  if (type === 'CommentUpdated') {
    const { commentId, postId, content, status } = data;

    const post = posts[postId];

    const comment = post.comments.find((comment) => {
      return comment.commentId === commentId;
    });

    comment.status = status;
    comment.content = content;
  }
};

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/events', (req, res) => {
  const { type, data } = req.body;

  handleEvent(type, data);

  res.send({});
});

app.listen(4002, async () => {
  console.log('Listening on 4002 (query)');

  const res = await axios.get('http://event-bus-srv:4005/events').catch((err) => {
    console.log(err.message);
  });

  if ('data' in res === false) {
    return;
  }

  for (let event of res.data) {
    console.log('Processing event:', event.type);

    handleEvent(event.type, event.data);
  }
});
