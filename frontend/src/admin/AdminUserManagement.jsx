import React from "react";
import { Dialog } from "@headlessui/react";
import useAdminUserManagement from "../hooks/adminHooks/useAdminUserManagement";

function AdminUserManagement() {
  const {
    users,
    loading,
    error,
    hasMore,
    fetchUsers,

    isOpen,
    setIsOpen,
    formData,
    setFormData,
    handleDelete,
    openEditModal,
    handleEditSubmit,
  } = useAdminUserManagement();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Admin User Management</h1>

      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto rounded shadow">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b text-left">Name</th>
              <th className="py-2 px-4 border-b text-left">Email</th>
              <th className="py-2 px-4 border-b text-left">Mobile</th>
              <th className="py-2 px-4 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{user.name}</td>
                <td className="py-2 px-4 border-b">{user.email}</td>
                <td className="py-2 px-4 border-b">{user.phone || "-"}</td>
                <td className="py-2 px-4 border-b space-x-2">
                  <button
                    onClick={() => openEditModal(user)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* LOAD MORE */}
      {hasMore && (
        <div className="text-center mt-4">
          <button
            onClick={() => fetchUsers(true)}
            disabled={loading}
            className="bg-pink-500 text-white px-6 py-2 rounded hover:bg-pink-600"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}

      {/* EDIT MODAL */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="fixed inset-0 z-50">
        <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-40">
          <Dialog.Panel className="bg-white rounded-lg p-6 w-full max-w-md">
            <Dialog.Title className="text-lg font-semibold mb-4">
              Edit User
            </Dialog.Title>

            <input
              className="w-full border p-2 mb-2"
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <input
              className="w-full border p-2 mb-2"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />

            <input
              className="w-full border p-2 mb-4"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Save
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}

export default AdminUserManagement;
