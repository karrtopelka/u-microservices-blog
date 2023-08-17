import { useState, useEffect } from 'react';
import axios from 'axios';
import CommentCreate from './CommentCreate';
import CommentsList from './CommentsList';

const PostList = () => {
  const [posts, setPosts] = useState({});

  const fetchPosts = async () => {
    const res = await axios.get('http://posts.com/posts').catch((err) => {
      console.log(err.message);
    });

    setPosts(res ? res.data : {});
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className='d-flex flex-row flex-wrap justify-content-between'>
      {Object.values(posts).map((post) => (
        <div key={post.id} className='card' style={{ width: '30%', marginBottom: 20 }}>
          <div className='card-body'>
            <h3>{post.title}</h3>
            <CommentCreate postId={post.id} />
            <hr />
            <CommentsList comments={post.comments} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostList;
