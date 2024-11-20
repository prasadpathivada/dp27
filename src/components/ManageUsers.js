import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', email: '', role: '' });

    // Fetch users on component load
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("token"); // Ensure token is stored
                console.log("Token in localStorage:", token);
                if (!token) {
                    console.error("No token found in localStorage");
                    return;
                }
                
                const response = await axios.get("http://localhost:8080/admin/users", {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include token in Authorization header
                    },
                });
                console.log("Users:", response.data);
                setUsers(response.data); // Set the fetched users to the state
            } catch (error) {
                // Log the error details
                if (error.response) {
                    // The server responded with a status code outside the 2xx range
                    console.error("Error fetching users:", error.response.data);
                    console.error("Status Code:", error.response.status);
                    console.error("Headers:", error.response.headers);
                } else if (error.request) {
                    // The request was made but no response was received
                    console.error("Error in request:", error.request);
                } else {
                    // Something happened in setting up the request
                    console.error("General error:", error.message);
                }
            }
        };
        fetchUsers();
    }, []); // Only run once when the component mounts
    

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({ ...prev, [name]: value }));
    };

    // Save updated user
    const handleSave = async () => {
        if (!editForm.name || !editForm.email || !editForm.role) {
            alert('Please fill all fields.');
            return;
        }
        try {
            const response = await axios.put(
                `http://localhost:8080/admin/users/${editingUser.id}`,
                editForm,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            setUsers((prev) =>
                prev.map((user) => (user.id === editingUser.id ? response.data : user))
            );
            setEditingUser(null); // Close the edit form
            setEditForm({ name: '', email: '', role: '' }); // Clear the form fields
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Manage Users</h1>
            <table className="w-full border-collapse border border-gray-200">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2">ID</th>
                        <th className="border border-gray-300 px-4 py-2">Name</th>
                        <th className="border border-gray-300 px-4 py-2">Email</th>
                        <th className="border border-gray-300 px-4 py-2">Role</th>
                        <th className="border border-gray-300 px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2">{user.id}</td>
                            <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                            <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                            <td className="border border-gray-300 px-4 py-2">{user.role}</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    onClick={() => {
                                        setEditingUser(user);
                                        setEditForm({ name: user.name, email: user.email, role: user.role });
                                    }}
                                >
                                    Update
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Edit Form */}
            {editingUser && (
                <div className="mt-8 bg-white shadow-lg rounded-lg p-6">
                    <h2 className="text-2xl font-bold mb-4">Edit User</h2>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={editForm.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={editForm.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Role</label>
                        <input
                            type="text"
                            name="role"
                            value={editForm.role}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                    </div>
                    <button
                        onClick={handleSave}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        Save Changes
                    </button>
                    <button
                        onClick={() => setEditingUser(null)}
                        className="ml-4 bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
};

export default ManageUsers;
