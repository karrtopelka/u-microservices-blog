const express = require('express');
const cors = require('cors');
const { randomBytes } = require('crypto');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: '*',
  }),
);

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
  const { id } = req.params;

  res.send(commentsByPostId[id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
  const { id } = req.params;

  const commentId = randomBytes(4).toString('hex');

  const { content } = req.body;

  const newComment = {
    commentId,
    content,
    status: 'pending',
  };

  commentsByPostId[id] = [...(commentsByPostId[id] || []), newComment];

  await axios.post('http://event-bus-srv:4005/events', {
    type: 'CommentCreated',
    data: {
      ...newComment,
      postId: id,
    },
  });

  res.status(201).send(commentsByPostId[id]);
});

app.post('/events', (req, res) => {
  console.log('Received Event', req.body.type);

  const { type, data } = req.body;

  if (type === 'CommentModerated') {
    const { postId, commentId, status } = data;

    const comments = commentsByPostId[postId];

    const comment = comments.find((comment) => {
      return comment.commentId === commentId;
    });

    comment.status = status;

    axios.post('http://event-bus-srv:4005/events', {
      type: 'CommentUpdated',
      data: { ...comment, postId },
    });
  }

  res.send({ status: 'OK' });
});

app.listen(4001, () => {
  console.log('Listening on 4001 (comments)');
});
