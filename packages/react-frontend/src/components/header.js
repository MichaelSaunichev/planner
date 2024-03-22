import React, { useEffect, useState } from 'react';
import logo from './Logo.png';

const Header = ({ handleSignOut, serverStatus, databaseStatus }) => {

  const signOut = () => {
    handleSignOut()
  };

  return (
    <header className="bg-gray-400 py-4">
      <div className="container mx-auto flex justify-between items-center">
        <img src={logo} alt="Logo" className="h-10 w-auto" />
        <div className="status-bar ml-4" style={{ minWidth: "1px" }}> {/* Adjust the width as needed */}
          {serverStatus === null && databaseStatus === null && (
            <>Connection Status: Pending </>
          )}
          {serverStatus !== null && (
            <>Server Status: {serverStatus === 'ok' ? 'OK' : 'Error'}</>
          )}
          {databaseStatus !== null && (
            <> | Database Status: {databaseStatus === 'ok' ? 'OK' : 'Error'}</>
          )}
        </div>
        <nav>
          <ul className="flex space-x-1 text-gray-800">
            <li><span onClick={signOut} className="cursor-pointer hover:text-white">Sign Out</span></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;