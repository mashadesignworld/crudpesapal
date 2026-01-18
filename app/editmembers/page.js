"use client"; // Required for client-side interactivity
import { useState, useEffect } from "react";
import Navbar from '@/components/Navbar';


const EditMembers = () => {
  const [members, setMembers] = useState([]); // State to store members
  const [editingMember, setEditingMember] = useState(null); // State to track the member being edited
  const [formData, setFormData] = useState({
    name: "",
    nationalId: "",
    mobile: "",
    email: "",
    county: "",
    constituency: "",
    ward: "",
  }); // State for the edit form

  // Fetch all members from the API
  const fetchMembers = async () => {
    try {
      const response = await fetch("/api/registernewmember");
      if (!response.ok) throw new Error("Failed to fetch members");
      const data = await response.json();
      setMembers(data);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  // Fetch members when the component mounts
  useEffect(() => {
    fetchMembers();
  }, []);

  // Handle editing a member
  const handleEdit = (member) => {
    setEditingMember(member._id); // Set the member ID being edited
    setFormData({
      name: member.name,
      nationalId: member.nationalId,
      mobile: member.mobile,
      email: member.email,
      county: member.county,
      constituency: member.constituency,
      ward: member.ward,
    });
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission (update member)
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
        const errorData = await response.json();
        console.error("Error updating member:", errorData);
        throw new Error(errorData.error || "Failed to update member");
      }
  
      const updatedMember = await response.json();
      console.log("Member updated:", updatedMember);
  
      // Refresh the members list
      fetchMembers();
  
      // Reset the form and editing state
      setEditingMember(null);
      setFormData({
        name: "",
        nationalId: "",
        mobile: "",
        email: "",
        county: "",
        constituency: "",
        ward: "",
      });
    } catch (error) {
      console.error("Error updating member:", error.message || error);
      alert("Failed to update member: " + (error.message || "Unknown error occurred"));
    }
  };

  // Handle deleting a member
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/registernewmember?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete member");

      // Refresh the members list
      fetchMembers();
    } catch (error) {
      console.error("Error deleting member:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6 text-green-600">Edit Members</h1>

        {/* Members Table */}
        <div className="overflow-x-auto">
          {/* Desktop Table */}
          <table className="min-w-full bg-white border border-gray-200 hidden md:table">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="py-3 px-4 border">Name</th>
                <th className="py-3 px-4 border">National ID</th>
                <th className="py-3 px-4 border">Mobile</th>
                <th className="py-3 px-4 border">Email</th>
                <th className="py-3 px-4 border">County</th>
                <th className="py-3 px-4 border">Constituency</th>
                <th className="py-3 px-4 border">Ward</th>
                <th className="py-3 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member._id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-2 px-4 border">{member.name}</td>
                  <td className="py-2 px-4 border">{member.nationalId}</td>
                  <td className="py-2 px-4 border">{member.mobile}</td>
                  <td className="py-2 px-4 border">{member.email}</td>
                  <td className="py-2 px-4 border">{member.county}</td>
                  <td className="py-2 px-4 border">{member.constituency}</td>
                  <td className="py-2 px-4 border">{member.ward}</td>
                  <td className="py-2 px-4 border">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(member)}
                        className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 shadow-md"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(member._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 shadow-md"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile Table (Stacked Layout) */}
          <div className="md:hidden">
            {members.map((member) => (
              <div key={member._id} className="bg-white p-4 mb-4 rounded-lg shadow-md">
                <div className="space-y-2">
                  <p><strong>Name:</strong> {member.name}</p>
                  <p><strong>National ID:</strong> {member.nationalId}</p>
                  <p><strong>Mobile:</strong> {member.mobile}</p>
                  <p><strong>Email:</strong> {member.email}</p>
                  <p><strong>County:</strong> {member.county}</p>
                  <p><strong>Constituency:</strong> {member.constituency}</p>
                  <p><strong>Ward:</strong> {member.ward}</p>
                </div>
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={() => handleEdit(member)}
                    className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 shadow-md"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(member._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 shadow-md"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Edit Form */}
        {editingMember && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-96">
              <h2 className="text-xl font-bold mb-4 text-green-600">Edit Member</h2>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="w-full p-2 border rounded mb-2 shadow-sm"
                />
                <input
                  type="text"
                  name="nationalId"
                  value={formData.nationalId}
                  onChange={handleChange}
                  placeholder="National ID"
                  className="w-full p-2 border rounded mb-2 shadow-sm"
                />
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Mobile"
                  className="w-full p-2 border rounded mb-2 shadow-sm"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full p-2 border rounded mb-2 shadow-sm"
                />
                <input
                  type="text"
                  name="county"
                  value={formData.county}
                  onChange={handleChange}
                  placeholder="County"
                  className="w-full p-2 border rounded mb-2 shadow-sm"
                />
                <input
                  type="text"
                  name="constituency"
                  value={formData.constituency}
                  onChange={handleChange}
                  placeholder="Constituency"
                  className="w-full p-2 border rounded mb-2 shadow-sm"
                />
                <input
                  type="text"
                  name="ward"
                  value={formData.ward}
                  onChange={handleChange}
                  placeholder="Ward"
                  className="w-full p-2 border rounded mb-2 shadow-sm"
                />
                <div className="flex justify-end mt-4">
                  <button
                    type="button"
                    onClick={() => setEditingMember(null)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-gray-600 shadow-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 shadow-md"
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