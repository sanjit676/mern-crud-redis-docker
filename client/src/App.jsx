import React, { useEffect, useState } from "react";
import axios from "axios";

export default function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);

  function getItems() {
    axios
      .get("/api/items")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setItems(res.data);
        } else if (Array.isArray(res.data.items)) {
          setItems(res.data.items);
        } else {
          setItems([]);
        }
      })
      .catch(() => {
        setItems([]);
      });
  }

  useEffect(() => {
    getItems();
  }, []);

  const addItem = () => {
    if (!name.trim()) return;
    axios
      .post("/api/items", { name })
      .then((res) => {
        if (res.data) {
          setName("");
          getItems();
        }
      })
      .catch(() => {});
  };

  const updateItem = () => {
    if (!name.trim() || !editId) return;
    axios
      .put(`/api/items/${editId}`, { name })
      .then((res) => {
        setItems((prev) =>
          prev.map((item) => (item._id === editId ? res.data : item))
        );
        setEditId(null);
        setName("");
      })
      .catch(() => {});
  };

  const deleteItem = (id) => {
    axios
      .delete(`/api/items/${id}`)
      .then(() => {
        setItems((prev) => prev.filter((item) => item._id !== id));
      })
      .catch(() => {});
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">CRUD APP</h1>

      {/* Input + Add/Update button */}
      <div className="flex mb-6 space-x-2 justify-center">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Item name"
          className="border border-gray-300 rounded-md px-4 py-2 w-60 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {editId ? (
          <button
            onClick={updateItem}
            className="flex items-center gap-1 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-4 py-2 rounded-md transition"
            aria-label="Update Item"
          >
            {/* Update Icon (Pencil) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 5h2m-1 0v14m-7-7h14"
              />
            </svg>
            Update
          </button>
        ) : (
          <button
            onClick={addItem}
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md transition"
            aria-label="Add Item"
          >
            {/* Add Icon (Plus) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add
          </button>
        )}
      </div>

      {/* Items Table */}
      {Array.isArray(items) && items.length > 0 ? (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="border border-gray-300 px-6 py-3 text-left">#</th>
                <th className="border border-gray-300 px-6 py-3 text-left">Name</th>
                <th className="border border-gray-300 px-6 py-3 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr
                  key={item._id}
                  className="even:bg-gray-50 hover:bg-gray-100 transition"
                >
                  <td className="border border-gray-300 px-6 py-3">{idx + 1}</td>
                  <td className="border border-gray-300 px-6 py-3">{item.name}</td>
                  <td className="border border-gray-300 px-6 py-3 flex justify-center space-x-4">
                    {/* Edit Button */}
                    <button
                      onClick={() => {
                        setEditId(item._id);
                        setName(item.name);
                      }}
                      title="Edit item"
                      className="text-yellow-500 hover:text-yellow-600 transition"
                      aria-label={`Edit ${item.name}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11 5h2m-1 0v14m-7-7h14"
                        />
                      </svg>
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => {
                        if (
                          window.confirm(`Are you sure you want to delete "${item.name}"?`)
                        ) {
                          deleteItem(item._id);
                        }
                      }}
                      title="Delete item"
                      className="text-red-500 hover:text-red-600 transition"
                      aria-label={`Delete ${item.name}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 7l-1 12a2 2 0 01-2 2H8a2 2 0 01-2-2L5 7m5-4h4m-4 0a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1m-4 0h4"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-8">No items found.</p>
      )}
    </div>
  );
}
