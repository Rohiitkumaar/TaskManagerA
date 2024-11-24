import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";

function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [editTask, setEditTask] = useState(null);
  const auth = getAuth(); 
  const user = auth.currentUser; 

  const fetchTasks = async () => {
    if (user) {
      const querySnapshot = await getDocs(collection(db, "tasks"));
      const userTasks = querySnapshot.docs
        .map((doc) => ({ ...doc.data(), id: doc.id }))
        .filter((task) => task.userId === user.uid); 
      setTasks(userTasks);
    }
  };

  const addTask = async () => {
    if (newTask.title && newTask.description && user) {
      const newTaskData = {
        ...newTask,
        userId: user.uid, 
        createdBy: user.displayName || "Unknown User", 
        createdAt: serverTimestamp(),
      };
      const docRef = await addDoc(collection(db, "tasks"), newTaskData);
      setTasks((prevTasks) => [
        { ...newTaskData, id: docRef.id },
        ...prevTasks,
      ]);
      setNewTask({ title: "", description: "" });
    }
  };


  const updateTask = async (id, updatedTask) => {
    if (user && updatedTask.userId === user.uid) {
      const taskDoc = doc(db, "tasks", id);
      await updateDoc(taskDoc, updatedTask);
      setEditTask(null);
      fetchTasks();
    }
  };

  const deleteTask = async (id, taskUserId) => {
    if (user && taskUserId === user.uid) {
      await deleteDoc(doc(db, "tasks", id));
      fetchTasks();
    }
  };

  const handleEditClick = (task) => {
    setEditTask(task);
  };

  const handleUpdateChange = (e) => {
    setEditTask({ ...editTask, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        fetchTasks(); 
      } else {
        setTasks([]);
      }
    });
    return () => unsubscribe(); 
  }, []);


  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-10 text-white">
      <div className="max-w-xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Task Manager</h2>

        {user ? (
          <div className="space-y-3 mb-6">
            <input
              type="text"
              placeholder="Title"
              className="w-full p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Description"
              className="w-full p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
            />
            <button
              onClick={addTask}
              className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg transition-colors duration-200"
            >
              Add Task
            </button>
          </div>
        ) : (
          <p className="text-center text-gray-400 mb-6">
            Please log in to add tasks.
          </p>
        )}

        {editTask && user && (
          <div className="bg-gray-700 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-2">Edit Task</h3>
            <input
              type="text"
              placeholder="Title"
              name="title"
              className="w-full p-2 rounded-lg bg-gray-800 mb-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={editTask.title}
              onChange={handleUpdateChange}
            />
            <input
              type="text"
              placeholder="Description"
              name="description"
              className="w-full p-2 rounded-lg bg-gray-800 mb-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={editTask.description}
              onChange={handleUpdateChange}
            />
            <div className="flex justify-between">
              <button
                onClick={() => updateTask(editTask.id, editTask)}
                className="bg-yellow-500 hover:bg-yellow-600 py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Update
              </button>
              <button
                onClick={() => setEditTask(null)}
                className="bg-red-500 hover:bg-red-600 py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="bg-gray-700 p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-1">{task.title}</h3>
              <p className="text-gray-300 mb-2">{task.description}</p>
              {user && user.uid === task.userId && (
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => handleEditClick(task)}
                    className="bg-green-500 hover:bg-green-600 py-1 px-4 rounded-lg transition-colors duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTask(task.id, task.userId)}
                    className="bg-red-500 hover:bg-red-600 py-1 px-4 rounded-lg transition-colors duration-200"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TaskManager;
