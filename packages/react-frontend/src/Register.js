import React, { useState } from 'react';

const Register = ({ register, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [usernameAvailable, setUsernameAvailable] = useState(true);

  const handleRegister = (e) => {
    e.preventDefault();
    setPasswordsMatch(true);
    setUsernameAvailable(true);
    // Check if passwords match
    if (password === confirmPassword) {

      // Call the backend to add the user
      fetch(`${process.env.REACT_APP_API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userName,
          name: name,
          password: password,
        }),
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error(response.statusText);
          }
        })
        .then((userData) => {
          register(userData._id);
        })
        .catch(error => {
          setUsernameAvailable(false);
          console.error(error.message);
        });
    }
    else {
      setPasswordsMatch(false);
    }
  };

  return (
    <div className="mx-auto mt-8 p-8 bg-gray-200 rounded-md w-[500px] h-[600px]">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleRegister}>
        <label className="block mb-4">
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            className="w-full h-12 px-3 border rounded-md"
          />
        </label>
        <label className="block mb-4">
          Username:
          <input
            type="text"
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
              // console.log('userName changed:', e.target.value);
            }}
            className="w-full h-12 px-3 border rounded-md"
          />
        </label>
        <label className="block mb-4">
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              // console.log('password changed:', e.target.value);
            }}
            className="w-full h-12 px-3 border rounded-md"
          />
        </label>
        <label className="block mb-4">
          Confirm Password:
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              // console.log('confirm password changed:', e.target.value);
            }}
            className={`w-full h-12 px-3 border rounded-md ${
              !passwordsMatch ? 'border-red-500' : ''
            }`}
          />
        </label>
        {!passwordsMatch && (
          <p className="text-red-500 mb-4">Passwords do not match. Please try again.</p>
        )}
        {!usernameAvailable && (
          <p className="text-red-500 mb-4">Try another username.</p>
        )}
        <button type="submit" className="w-full h-12 bg-blue-500 text-white rounded-md">
          Register
        </button>
      </form>
      <p className="mt-4 text-blue-500">
        Already have an account?{' '}
        <span className="cursor-pointer" onClick={onSwitchToLogin}>
          Login here.
        </span>
      </p>
    </div>
  );
};

export default Register;