import React, { useState, useEffect } from "react";
import { FaTrash, FaTrashCan } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { IoClipboardOutline } from "react-icons/io5";
import { MdModeEditOutline } from "react-icons/md";
import { MdOutlineDone } from "react-icons/md";
import axios from "axios";

// API based URL from vite env
const API = import.meta.env.VITE_API_URL;

const App = () => {
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);
  const [editedText, setEditedText] = useState("");

  //! Add Todo
  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
     const response = await axios.post(`${API}/api/todos`, { text: newTodo });

      setTodos([...todos, response.data]);
      setNewTodo("");
    } catch (error) {
      console.log("Error adding todos", error);
    }
  };

  //
  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${API}/api/todos`);

      // console.log(response.data);

      setTodos(response.data);
    } catch (error) {
      console.log("Error in fetching Todos:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Editing Todo
  const startEditing = (todo) => {
    setEditingTodo(todo._id);
    setEditedText(todo.text);
  };

  //! Save Edited todos
  const saveEdit = async (id) => {
    try {
      const response = await axios.patch(`${API}/api/todos/${id}`, {
        text: editedText,
      });

      setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)));
      setEditingTodo(null);
      setEditedText("");
    } catch (error) {
      console.log("Error in saving edited todo:", error);
    }
  };

  //! Delete Todo
  const deleteTodo = async (id) => {
    try {
     
      await axios.delete(`${API}/api/todos/${id}`);

      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.log("Error in deleting Todos:", error);
    }
  };

  //! Toggle completed status todo

  const toggleTodo = async (id) => {
    try {
      const todo = todos.find((todo) => todo._id === id);
      const response = await axios.patch(`${API}/api/todos/${id}`, {
        completed: !todo.completed,
      });
      setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)));
    } catch (error) {
      console.log("Error in todo completion:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-700 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg">
        <h1 className="text-4xl text-black font-bold text-center mb-8">
          Task Manager
        </h1>

        <form
          onSubmit={addTodo}
          className="flex items-center gap-2 shadow-sm border border-gray-200 rounded-4xl  p-1.5 overflow-hidden "
        >
          <input
            onChange={(e) => setNewTodo(e.target.value)}
            value={newTodo}
            className="flex-1 px-3 py-2  w-full text-gray-700 placeholder-gray-600  outline-none "
            type="text"
            placeholder="Write your next goal....."
          />
          <button
            type="submit"
            className="bg-red-500 hover:bg-red-600 cursor-pointer font-medium text-white px-4 py-2 rounded-4xl"
          >
            Add Task
          </button>
        </form>

        <div className="mt-4">
          {todos.length === 0 ? (
            <div></div>
          ) : (
            <div className="flex flex-col gap-4">
              {todos.map((todo) => (
                <div key={todo._id}>
                  {" "}
                  {editingTodo === todo._id ? (
                    <div className="flex items-center gap-x-3">
                      <input
                        className="flex-1 p-3  border rounded-lg border-gray-200 outline-none focus:ring-2 focus:ring-blue-300 text-gray-700  shadow-inner"
                        type="text"
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                      />
                      <div className="flex gap-x-3">
                        <button
                          onClick={() => saveEdit(todo._id)}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 cursor-pointer"
                        >
                          {" "}
                          <MdOutlineDone />{" "}
                        </button>
                        <button
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer"
                          onClick={() => setEditingTodo(null)}
                        >
                          {" "}
                          <IoClose />{" "}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between overflow-hidden">
                        {" "}
                        <div className="flex items-center gap-x-4">
                          <button
                            onClick={() => toggleTodo(todo._id)}
                            className={`flex-shrink-0  h-6 w-6 border rounded-lg cursor-pointer flex items-center justify-center ${
                              todo.completed
                                ? "bg-green-500 text-white border-green-500"
                                : "border-gray-500 bg-gray-300 hover:border-blue-400"
                            }`}
                          >
                            {todo.completed && <MdOutlineDone />}
                          </button>
                        </div>
                        <span className="text-gray-800 font-medium truncate">
                          {" "}
                          {todo.text}
                        </span>
                        <div className="flex gap-x-2">
                          <button
                            className="p-2 text-blue-500 hover:text-blue-700 rounded-lg hover:bg-blue-200 duration-200 cursor-pointer"
                            onClick={() => startEditing(todo)}
                          >
                            <MdModeEditOutline />
                          </button>{" "}
                          <button
                            onClick={() => deleteTodo(todo._id)}
                            className="p-2 text-red-600 hover:text-red-700 rounded-lg hover:bg-red-200 duration-200 cursor-pointer"
                          >
                            <FaTrash />
                          </button>{" "}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
