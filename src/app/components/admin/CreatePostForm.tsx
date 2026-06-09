"use client"
import React, { useState, FormEvent } from 'react';

export default function CreatePostForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleUploadPosts = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/postPosts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }), 
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setSuccess('Post created successfully!');
      setTitle('');
      setDescription('');
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <div className="admin-card space-y-6">
      <form onSubmit={handleUploadPosts} className="space-y-4">
        <h1 className="admin-title">Create Post</h1>
        <div className="space-y-2">
          <label htmlFor="title" className="admin-label">Title</label>
          <input
            className="admin-control"
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="post" className="admin-label">Post</label>
          <textarea
            className="admin-control h-64 resize-none text-black"
            id="post"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <button type="submit" className="admin-button-primary-full">Create Post</button>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
      </form>
    </div>
  );
}
