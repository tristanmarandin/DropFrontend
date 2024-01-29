import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

const UserProfileDropdown = ({ username, profileImageUrl }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate(); // Hook to programmatically navigate

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownVisible(false);
    }
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleLogout = () => {
    sessionStorage.clear(); // Clears the sessionStorage
    navigate('/signIn'); // Redirects to the sign-in page
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownVisible]);

  return (
    <div className="user-container" ref={dropdownRef}>
      <div className="user-profile-container" onClick={toggleDropdown}>
        <img src={profileImageUrl} alt={username} className="user-profile-image" />
        <div className="user-name">{username}</div>
      </div>
      {dropdownVisible && (
        <div className="dropdown-content">
          <NavLink to="/user">My Profile</NavLink>
          <NavLink to="/user">My Collections</NavLink>
          <NavLink to="/user">My Images</NavLink>
          <NavLink to="/pricing">Pricing</NavLink>
          {/* Add a NavLink or button for the Disconnect option */}
          <button onClick={handleLogout} className="logout-button">Disconnect</button>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;
