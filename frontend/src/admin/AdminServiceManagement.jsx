import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { Plus, Trash2, Pencil } from 'lucide-react';

function AdminServiceManagement() {
  const [services, setServices] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    available: true,
  });
  const [editingId, setEditingId] = useState(null);

  const fetchServices = async () => {
    try {
      const res = await api.get('/services');
      setServices(res.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/services/${editingId}`, formData);
      } else {
        await api.post('/services', formData);
      }
      setFormData({ name: '', description: '', price: '', duration: '', available: true });
      setEditingId(null);
      setFormVisible(false);
      fetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  const handleEdit = (service) => {
    setFormData(service);
    setEditingId(service._id);
    setFormVisible(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this service?')) {
      try {
        await api.delete(`/services/${id}`);
        fetchServices();
      } catch (error) {
        console.error('Error deleting service:', error);
      }
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Service Management</h1>
        <button
          onClick={() => {
            setFormVisible(!formVisible);
            setEditingId(null);
            setFormData({ name: '', description: '', price: '', duration: '', available: true });
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full flex items-center gap-2"
        >
          <Plus size={18} /> Add Service
        </button>
      </div>

      {formVisible && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 shadow-md rounded-lg mb-8 space-y-4 border"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Service Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="border p-2 rounded w-full"
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              required
              className="border p-2 rounded w-full"
            />
            <input
              type="number"
              name="duration"
              placeholder="Duration (mins)"
              value={formData.duration}
              onChange={handleChange}
              required
              className="border p-2 rounded w-full"
            />
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="available"
                checked={formData.available}
                onChange={handleChange}
                className="accent-blue-600"
              />
              <span>Available</span>
            </label>
          </div>
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            {editingId ? 'Update Service' : 'Create Service'}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service) => (
          <div key={service._id} className="bg-gray-50 p-4 rounded-lg shadow border">
            <h3 className="text-xl font-semibold">{service.name}</h3>
            <p className="text-gray-600 mb-2">{service.description || 'No description.'}</p>
            <p className="text-sm">
              💰 <strong>{service.price}</strong> • 🕒 {service.duration} mins •{' '}
              <span
                className={`inline-block px-2 py-0.5 text-xs rounded-full ${
                  service.available ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'
                }`}
              >
                {service.available ? 'Available' : 'Unavailable'}
              </span>
            </p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleEdit(service)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded flex items-center gap-1"
              >
                <Pencil size={16} /> Edit
              </button>
              <button
                onClick={() => handleDelete(service._id)}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded flex items-center gap-1"
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminServiceManagement;
