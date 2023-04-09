import React from 'react';
import './userSection.css';

function UserSection({ username }) {

  return (
    <div className="user-section">
        <h1 className="title">User Section</h1>
        <h3 className="username"> Logged in as: <span>{username}</span> </h3>
        <hr />
    </div>
  );
}

export default UserSection;
