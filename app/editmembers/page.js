"use client";
import { useState, useEffect } from "react";
import Navbar from '@/components/Navbar';

const EditMembers = () => {
  const [members, setMembers] = useState([]);
  const [editingMember, setEditingMember] = useState(null);
  const [loading, setLoading] = useState(true); // start with loading true
  const [formData, setFormData] = useState({
    name: "",
    nationalId: "",
    mobile: "",
    email: "",
    county: "",
    constituency: "",
    ward: "",
  });

  // ────────────────────────────────────────────────
  // Fetch members - with cache busting to avoid 304 stale responses
  // ────────────────────────────────────────────────
  const fetchMembers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/registernewmember?_=${Date.now()}`, {
        cache: "no-store", // prevent browser & Next.js from caching
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch members: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      setMembers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching members:", error);
      alert("Could not load members. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // ────────────────────────────────────────────────
  // Edit handler
  // ────────────────────────────────────────────────
  const handleEdit = (member) => {
    const id = member.id || member._id; // handle both Prisma id & possible legacy _id
    setEditingMember(id);
    setFormData({
      name: member.name || "",
      nationalId: member.nationalId || "",
      mobile: member.mobile || "",
      email: member.email || "",
      county: member.county || "",
      constituency: member.constituency || "",
      ward: member.ward || "",
    });
  };

  // ────────────────────────────────────────────────
  // Form change handler
  // ────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ────────────────────────────────────────────────
  // Submit edit (PUT)
  // ────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/registernewmember", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingMember,
          ...formData,
        }),
      });

      if (!response.ok) {
        let errorMsg = "Failed to update member";
        try {
          const errData = await response.json();
          errorMsg = errData.error || errorMsg;
        } catch {}
        throw new Error(errorMsg);
      }

      // Refresh list after successful update
      await fetchMembers();
      setEditingMember(null);

      // Optional success feedback
      alert("Member updated successfully!");
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update member: " + (error.message || "Unknown error"));
    }
  };

  // ────────────────────────────────────────────────
  // Delete member
  // ────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;

    try {
      const response = await fetch(`/api/registernewmember?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        let errorMsg = "Failed to delete member";
        try {
          const errData = await response.json();
          errorMsg = errData.error || errorMsg;
        } catch {}
        throw new Error(errorMsg);
      }

      // Refresh list after delete
      await fetchMembers();
      alert("Member deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete member: " + (error.message || "Unknown error"));
    }
  };

  return (
    <>
      <Navbar />

      <div className="p-4 max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-green-700">
          Edit Members
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : members.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            No members found. Add some members to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Desktop Table */}
            <table className="min-w-full bg-white border border-gray-200 hidden md:table rounded-lg overflow-hidden">
              <thead className="bg-green-600 text-white">
                <tr>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">National ID</th>
                  <th className="py-3 px-4 text-left">Mobile</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-left">County</th>
                  <th className="py-3 px-4 text-left">Constituency</th>
                  <th className="py-3 px-4 text-left">Ward</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.id || member._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 border-b">{member.name}</td>
                    <td className="py-3 px-4 border-b">{member.nationalId}</td>
                    <td className="py-3 px-4 border-b">{member.mobile}</td>
                    <td className="py-3 px-4 border-b">{member.email}</td>
                    <td className="py-3 px-4 border-b">{member.county}</td>
                    <td className="py-3 px-4 border-b">{member.constituency}</td>
                    <td className="py-3 px-4 border-b">{member.ward}</td>
                    <td className="py-3 px-4 border-b">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEdit(member)}
                          className="bg-green-600 text-white px-4 py-1.5 rounded hover:bg-green-700 transition shadow-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(member.id || member._id)}
                          className="bg-red-600 text-white px-4 py-1.5 rounded hover:bg-red-700 transition shadow-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {members.map((member) => (
                <div
                  key={member.id || member._id}
                  className="bg-white p-5 rounded-lg shadow-md border border-gray-200"
                >
                  <div className="space-y-2 mb-4">
                    <p><strong>Name:</strong> {member.name}</p>
                    <p><strong>National ID:</strong> {member.nationalId}</p>
                    <p><strong>Mobile:</strong> {member.mobile}</p>
                    <p><strong>Email:</strong> {member.email}</p>
                    <p><strong>County:</strong> {member.county}</p>
                    <p><strong>Constituency:</strong> {member.constituency}</p>
                    <p><strong>Ward:</strong> {member.ward}</p>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleEdit(member)}
                      className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(member.id || member._id)}
                      className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editingMember && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
              <h2 className="text-xl font-bold mb-5 text-green-700">Edit Member</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { name: "name", label: "Full Name", type: "text" },
                  { name: "nationalId", label: "National ID", type: "text" },
                  { name: "mobile", label: "Mobile", type: "tel" },
                  { name: "email", label: "Email", type: "email" },
                  { name: "county", label: "County", type: "text" },
                  { name: "constituency", label: "Constituency", type: "text" },
                  { name: "ward", label: "Ward", type: "text" },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                      required
                    />
                  </div>
                ))}

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setEditingMember(null)}
                    className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default EditMembers;