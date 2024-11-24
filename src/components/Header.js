import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";


import ProfileSection from "./ProfileSection";

const Header = () => {
  const [username, setUsername] = useState("Login");
  const [email, setEmail] = useState("user@gmail.com");

  const navigate = useNavigate();

  const db = getFirestore();
  const auth = getAuth();

  useEffect(() => {
    const fetchUsername = async () => {
      const user = auth.currentUser;

      if (user) {
        setUsername(user.displayName || "User");
        setEmail(user.email || "");

        const userDoc = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
          setUsername(userSnapshot.data().username || "User");
          setEmail(userSnapshot.data().email || user.email);
        }
      } else {
        setUsername("User");
        setEmail("user@gmail.com");
      }
    };

    fetchUsername();
  }, [auth.currentUser, db]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUsername("User");
      setEmail("user@gmail.com");
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  return (
    <div className="sticky top-0 z-10 flex flex-row items-center justify-between h-[3.9rem] px-4 md:px-5 bg-white dark:bg-black">
      <div className="flex items-center">
        <Link to="/" className="flex items-center">
          <h1 className="text-lg md:text-xl text-white font-semibold">
            T A S K | M A N A G E R
          </h1>
        </Link>
      </div>

      <div className="flex items-center">
        <Link to="/taskmanager" className="flex items-center">
          <h1 className="text-m md:text-sm text-white font-semibold">
            My Tasks
          </h1>
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <ProfileSection
          username={username}
          email={email}
          navigate={navigate}
          handleLogout={handleLogout}
        />
      </div>
    </div>
  );
};

export default Header;
