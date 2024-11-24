import React, { useState, useEffect, useRef } from "react";
import { auth } from "../firebase";

const ProfileSection = ({ navigate, handleLogout }) => {
  const [username, setUsername] = useState("Login");
  const [email, setEmail] = useState("user@gmail.com");

  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null);
  const buttonRef = useRef(null);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUsername(user.displayName || "User");
        setEmail(user.email);
      } else {
        setUsername("User");
        setEmail("user@gmail.com");
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowPopup(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const getProfileImage = () => {
    if (username === "User") return "/empty-profile2.jpg";
    return username.endsWith("a") || username.endsWith("i")
      ? "/girl1.jpg"
      : "/man2.jpg";
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        className="flex items-center space-x-1 bg-transparent border-none cursor-pointer"
        onClick={togglePopup}
      >
        <div className="h-8 w-8 overflow-hidden rounded-full">
          <img
            src={getProfileImage()}
            alt="profile"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="hidden md:block bg-black text-white py-1 px-2 rounded-lg">
          {username === "User" ? "" : <span>{username}</span>}
        </div>
      </button>

      {showPopup && (
        <div
          ref={popupRef}
          className="absolute right-0 mt-2 w-48 bg-gray-800 text-white rounded-lg shadow-md z-50"
        >
          <div className="p-4">
            <h3 className="text-sm font-semibold mb-2 text-white">Account</h3>
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-10 w-10 overflow-hidden rounded-full">
                <img
                  src={getProfileImage()}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                {username !== "User" && (
                  <p className="text-sm font-semibold text-white">{username}</p>
                )}
                <p className="text-xs text-gray-400">
                  {username === "User" ? "user@gmail.com" : email}
                </p>
              </div>
            </div>
            {username === "User" ? (
              <button
                onClick={() => {
                  navigate("/login");
                  setShowPopup(false);
                }}
                className="w-full bg-red-500 hover:bg-red-600 text-white text-sm py-2 rounded"
              >
                Login
              </button>
            ) : (
              <button
                onClick={() => {
                  handleLogout();
                  setShowPopup(false);
                }}
                className="w-full bg-red-500 hover:bg-red-600 text-white text-sm py-2 rounded"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;
