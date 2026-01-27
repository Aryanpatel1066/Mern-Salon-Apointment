import React from "react";
import api from "../api/api";
import { Dialog } from "@headlessui/react";
import { toast } from "react-toastify";

import useAdminUserManagement from "../hooks/adminHooks/useAdminUserManagement";

function AdminUserManagement() {
  const {
    users,
    loading,
    error,
    isOpen,
    setIsOpen,
    selectedUser,
    formData,
    setFormData,
    handleDelete,
    openEditModal,
    handleEditSubmit,
  } = useAdminUserManagement();

  if (loading) return <div className="p-4 text-center">Loading users...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Admin User Management</h1>
      <div className="overflow-x-auto rounded shadow">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left py-2 px-4 border-b">Name</th>
              <th className="text-left py-2 px-4 border-b">Email</th>
              <th className="text-left py-2 px-4 border-b">Mobile</th>
              <th className="text-left py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{user.name}</td>
                <td className="py-2 px-4 border-b">{user.email}</td>
                <td className="py-2 px-4 border-b">{user.phone}</td>
                <td className="py-2 px-4 border-b space-x-2">
                  <button
                    onClick={() => openEditModal(user)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-30">
          <Dialog.Panel className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
            <Dialog.Title className="text-xl font-semibold mb-4">Edit User</Dialog.Title>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  className="mt-1 w-full border px-3 py-2 rounded"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  className="mt-1 w-full border px-3 py-2 rounded"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mobile</label>
                <input
                  type="text"
                  className="mt-1 w-full border px-3 py-2 rounded"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => setIsOpen(false)}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSubmit}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Save
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}

export default AdminUserManagement;
