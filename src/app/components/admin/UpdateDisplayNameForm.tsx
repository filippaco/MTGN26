"use client"
import React, { useState, FormEvent } from 'react';

export default function UpdateDisplayNameForm() {
  const [displayNameUid, setDisplayNameUid] = useState('');
  const [displayName, setDisplayName] = useState('');

  const handleSubmitName = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/updateDisplayName", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid: displayNameUid, displayName }),
      });

      if (!response.ok) {
        console.error("HTTP error", response.status);
        alert("Failed to update user: " + response.statusText);
        return;
      }

      const data = await response.json();
      console.log("Success:", data);
      alert("User updated successfully!");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error:", error);
        alert("Failed to update user: " + error.message);
      }
    }
  };

  return (
    <div className="admin-card space-y-6">
      <form onSubmit={handleSubmitName} className="space-y-4">
        <h1 className="admin-title">Update User DisplayName</h1>
        <div className="space-y-2">
          <label htmlFor="uid" className="admin-label">User ID</label>
          <input
            className="admin-control"
            type="text"
            id="uid"
            value={displayNameUid}
            onChange={(e) => setDisplayNameUid(e.target.value)}
            autoComplete="off"
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="displayName" className="admin-label">Display Name</label>
          <input
            className="admin-control"
            type="text"
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            autoComplete="off"
            required
          />
        </div>
        <button type="submit" className="admin-button-primary-full">Update User</button>
      </form>
    </div>
  );
}
