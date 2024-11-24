
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      setError(getErrorMessage(err.code));
    }
  };

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/user-not-found":
        return "No account found with this email. Please sign up.";
      case "auth/wrong-password":
        return "Incorrect password. Please try again.";
      case "auth/email-already-in-use":
        return "The email address is already in use. Please use a different email.";
      case "auth/invalid-credential":
        return "The credentials you provided are invalid. Please check and try again.";
      default:
        return "An error occurred. Please try again.";
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <form
        onSubmit={handleLogin}
        className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-white mb-6">Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-md 
          text-gray-900
          focus:outline-none focus:border-green-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 border border-gray-300 rounded-md 
          text-gray-900
          focus:outline-none focus:border-green-500"
        />
        <button
          type="submit"
          className="w-full py-3 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600"
        >
          Login
        </button>
        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        <p className="mt-4 text-center text-sm text-white">
          Don't have account? Create new account{" "}
          <span
            className="text-green-500 cursor-pointer hover:underline"
            onClick={() => navigate("/signup")}
          >
            Signup here
          </span>
        </p>
      </form>
    </div>
  );
}

export default Login;
