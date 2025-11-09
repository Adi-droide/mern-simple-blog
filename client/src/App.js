import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/posts`);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const createPost = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    try {
      await axios.post(`${API_URL}/api/posts`, {
        title: title.trim(),
        content: content.trim(),
        author: author.trim() || 'Anonymous'
      });
      setTitle('');
      setContent('');
      setAuthor('');
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const deletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await axios.delete(`${API_URL}/api/posts/${postId}`);
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>📝 Simple Blog</h1>
        <p>Share your thoughts with the world</p>
      </header>

      <main className="main">
        <section className="post-form">
          <h2>Create New Post</h2>
          <form onSubmit={createPost}>
            <input
              type="text"
              placeholder="Post Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Your Name (optional)"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
            <textarea
              placeholder="Write your post content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
            <button type="submit">Publish Post</button>
          </form>
        </section>

        <section className="posts">
          <h2>Recent Posts ({posts.length})</h2>
          <div className="posts-grid">
            {posts.length === 0 ? (
              <p className="no-posts">No posts yet. Be the first to share!</p>
            ) : (
              posts.map((post) => (
                <article key={post._id} className="post-card">
                  <h3>{post.title}</h3>
                  <p className="post-content">{post.content}</p>
                  <div className="post-meta">
                    <span>By: {post.author}</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  <button 
                    onClick={() => deletePost(post._id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </article>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
