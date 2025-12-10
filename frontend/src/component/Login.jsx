import React from 'react';

function Login({ onSelectPortal }) {
  return (
    <div className="login">
      <h1>Welcome to College Admission System</h1>
      <p>Select your portal:</p>
      <button onClick={() => onSelectPortal('student')}>Student Portal</button>
      <button onClick={() => onSelectPortal('admin')}>Admin Portal</button>
    </div>
  );
}

export default Login;
