import useAdminClosedDays from "../hooks/adminHooks/useAdminClosedDays";

function AdminClosedDays() {
  const { closedDays, newDate, setNewDate, handleAdd, handleDelete } =
    useAdminClosedDays();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Manage Closed Days
      </h1>

      {/* Add Closed Day */}
      <div className="flex gap-2 mb-6">
        <input
          type="date"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={handleAdd}
          className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
        >
          Add Closed Day
        </button>
      </div>

      {/* List Closed Days */}
      <div className="bg-white rounded shadow p-4">
        {closedDays.length === 0 ? (
          <p className="text-gray-600">No closed days added yet</p>
        ) : (
          <ul className="space-y-2">
            {closedDays.map((day) => (
              <li
                key={day._id}
                className="flex justify-between items-center border-b pb-2"
              >
                <span className="text-gray-700">{day.date}</span>
                <button
                  onClick={() => handleDelete(day._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default AdminClosedDays;
