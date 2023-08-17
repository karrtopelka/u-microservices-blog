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

const posts = {};

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/posts/create', async (req, res) => {
  const id = randomBytes(4).toString('hex');

  const { title } = req.body;

  const newPost = {
    id,
    title,
  };

  posts[id] = newPost;

  await axios
    .post('http://event-bus-srv:4005/events', {
      type: 'PostCreated',
      data: newPost,
    })
    .catch((err) => {
      console.log(err.message);
    });

  res.status(201).send(newPost);
});

app.post('/events', (req, res) => {
  console.log('Received Event', req.body.type);

  res.send({ status: 'OK' });
});

app.listen(4000, () => {
  console.log('Listening on 4000 (posts)!');
});
