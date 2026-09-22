import React, { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('abhr@example.com');
  const [loginPassword, setLoginPassword] = useState('123');
  const [loginError, setLoginError] = useState('');

  // Form State (for Create / Update)
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'User' });

  // 1. Fetch Users (READ)
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/users`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.message || 'Login failed');
        return;
      }
      setCurrentUser(data.user);
    } catch (err) {
      setLoginError('Could not connect to backend');
    }
  };

  // 3. Create or Update User (CREATE / UPDATE)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    if (editingId) {
      // UPDATE (PUT)
      await fetch(`${API_URL}/api/users/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setEditingId(null);
    } else {
      // CREATE (POST)
      await fetch(`${API_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
    }

    setFormData({ name: '', email: '', role: 'User' });
    fetchUsers();
  };

  // 4. Delete User (DELETE)
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await fetch(`${API_URL}/api/users/${id}`, { method: 'DELETE' });
    fetchUsers();
  };

  // Start Edit
  const handleEdit = (user) => {
    setEditingId(user.id);
    setFormData({ name: user.name, email: user.email, role: user.role });
  };

  // Cancel Edit
  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', email: '', role: 'User' });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-indigo-400">Docker CRUD App</h1>
            <p className="text-sm text-slate-400">Express Backend (In-memory Array) + Vite React Frontend</p>
          </div>
          {currentUser && (
            <div className="flex items-center gap-3">
              <span className="text-sm bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                👤 {currentUser.name} ({currentUser.role})
              </span>
              <button
                onClick={() => setCurrentUser(null)}
                className="text-xs bg-rose-600/80 hover:bg-rose-600 px-3 py-1.5 rounded-lg transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Login Box (If not logged in) */}
        {!currentUser ? (
          <div className="max-w-md mx-auto bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg space-y-4">
            <h2 className="text-xl font-semibold text-white">Login</h2>
            {loginError && <p className="text-xs text-rose-400">{loginError}</p>}
            
            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Email</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Password</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 rounded-lg text-sm transition"
              >
                Login
              </button>
            </form>
            <p className="text-xs text-slate-400 text-center">Default: abhr@example.com / 123</p>
          </div>
        ) : (
          /* Logged In: Simple User CRUD */
          <div className="space-y-6">
            
            {/* Form: Add / Edit User */}
            <form onSubmit={handleSubmit} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-wrap gap-3 items-end">
              <div className="flex-1 min-w-[180px]">
                <label className="block text-xs text-slate-400 mb-1">Name</label>
                <input
                  type="text"
                  placeholder="Enter name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs text-slate-400 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div className="w-32">
                <label className="block text-xs text-slate-400 mb-1">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition ${
                    editingId ? 'bg-amber-600 hover:bg-amber-500' : 'bg-indigo-600 hover:bg-indigo-500'
                  }`}
                >
                  {editingId ? 'Update' : 'Add User'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-slate-300"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            {/* Users Table */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-900 text-slate-400 text-xs uppercase border-b border-slate-700">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Role</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-4 text-center text-slate-400">No users found.</td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-750">
                        <td className="p-3 text-slate-400 font-mono text-xs">{u.id}</td>
                        <td className="p-3 font-medium text-white">{u.name}</td>
                        <td className="p-3 text-slate-300">{u.email}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            u.role === 'Admin' ? 'bg-indigo-900/60 text-indigo-300 border border-indigo-700' : 'bg-slate-700 text-slate-300'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => handleEdit(u)}
                            className="text-xs bg-slate-700 hover:bg-slate-600 text-white px-2.5 py-1 rounded transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(u.id)}
                            className="text-xs bg-rose-700 hover:bg-rose-600 text-white px-2.5 py-1 rounded transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
