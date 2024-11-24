
import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]); // All tasks
  const [filteredTasks, setFilteredTasks] = useState([]); 
  const [user, setUser] = useState(null); 
  const [searchQuery, setSearchQuery] = useState(""); 
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    fetchTasks();
    return () => unsubscribe();
  }, []);

  const fetchTasks = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "tasks"));
      const fetchedTasks = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setTasks(fetchedTasks); 
      setFilteredTasks(fetchedTasks); 
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase().trim();
    setSearchQuery(query);
    if (query === "") {
      setFilteredTasks(tasks); 
    } else {
      const filtered = tasks.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query)
      );
      setFilteredTasks(filtered);
    }
  };
  const handleEditClick = (taskId) => {
    navigate(`/taskmanager?taskId=${taskId}`);
  };

  const deleteTask = async (taskId) => {
    try {
      await deleteDoc(doc(db, "tasks", taskId));
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId)); 
      setFilteredTasks((prevTasks) =>
        prevTasks.filter((task) => task.id !== taskId)
      );
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {!user && (
        <div className="bg-yellow-500 text-black p-4 rounded-md mb-6 text-center">
          Please{" "}
          <Link to="/login" className="underline font-semibold">
            Login
          </Link>{" "}
          to write and manage tasks.
        </div>
      )}

      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={handleSearch}
          className="h-10 bg-gray-800 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 w-1/2"
        />
      </div>

      {filteredTasks.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="bg-gray-800 rounded-lg shadow-lg p-6 relative"
            >
              <h3 className="text-xl font-bold mb-2">{task.title}</h3>
              <p className="text-gray-300 mb-4">{task.description}</p>
              <p className="absolute bottom-3 right-3 text-sm text-gray-400">
                Created by: {task.createdBy}
              </p>
              {user && task.userId === user.uid && (
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={() => handleEditClick(task.id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400">No tasks available.</p>
      )}
    </div>
  );
};

export default Dashboard;
