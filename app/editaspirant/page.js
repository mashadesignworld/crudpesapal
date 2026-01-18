"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { FaEdit, FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
// import Footer from "@/components/Footer";   // ← uncomment if you want it back

const EditAspirant = () => {
  const [aspirants, setAspirants] = useState([]);
  const [editingAspirant, setEditingAspirant] = useState(null);
  const [loading, setLoading] = useState(true); // start as true
  const [counties, setCounties] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    nationalId: "",
    mobile: "",
    email: "",
    position: "",
    county: "",
    constituency: "",
    ward: "",
  });

  // ────────────────────────────────────────────────
  // Fetch functions with cache busting + better error handling
  // ────────────────────────────────────────────────
  const fetchAspirants = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/aspirantnew?_=${Date.now()}`, {
        cache: "no-store",           // prevent stale cache
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Failed to fetch aspirants: ${errText}`);
      }

      const data = await response.json();
      setAspirants(data || []);
    } catch (error) {
      console.error("Error fetching aspirants:", error);
      // Optional: alert("Could not load aspirants. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCountyData = async () => {
    try {
      const res = await fetch("/county.json");
      if (!res.ok) throw new Error("Failed to load counties");
      const data = await res.json();
      setCounties(data);
    } catch (err) {
      console.error("Error loading counties:", err);
    }
  };

  useEffect(() => {
    fetchAspirants();
    fetchCountyData();
  }, []);

  const handleEdit = (aspirant) => {
    setEditingAspirant(aspirant.id || aspirant._id); // safer: Prisma often returns id
    setFormData({ ...aspirant });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/aspirantnew", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingAspirant, ...formData }),
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(`Update failed: ${err}`);
      }

      await fetchAspirants();       // refresh list
      setEditingAspirant(null);     // close modal
      // Optional success feedback: alert("Aspirant updated!");
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update aspirant: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this aspirant?")) return;

    try {
      const response = await fetch(`/api/aspirantnew?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(`Delete failed: ${err}`);
      }

      await fetchAspirants();       // refresh list
      // Optional: alert("Aspirant deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete: " + error.message);
    }
  };

  return (
    <>
      <Navbar />

      <div className="p-6 min-h-screen bg-gray-50">
        <h1 className="text-3xl font-extrabold mb-8 text-green-700">Manage Aspirants</h1>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : aspirants.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            No aspirants available yet.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aspirants.map((aspirant) => (
              <div
                key={aspirant.id || aspirant._id}
                className="bg-white rounded-xl p-5 shadow hover:shadow-md transition"
              >
                <h2 className="text-xl font-bold text-green-600">{aspirant.name}</h2>
                <p className="text-sm text-gray-500 mb-4">{aspirant.position}</p>

                <div className="space-y-1 text-sm text-gray-700">
                  <p><strong>ID:</strong> {aspirant.nationalId}</p>
                  <p><strong>Mobile:</strong> {aspirant.mobile}</p>
                  <p><strong>Email:</strong> {aspirant.email}</p>
                  <p><strong>County:</strong> {aspirant.county}</p>
                  <p><strong>Constituency:</strong> {aspirant.constituency}</p>
                  <p><strong>Ward:</strong> {aspirant.ward}</p>
                </div>

                <div className="flex space-x-4 mt-5">
                  <button
                    onClick={() => handleEdit(aspirant)}
                    className="flex items-center gap-1 px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded shadow-sm transition"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(aspirant.id || aspirant._id)}
                    className="flex items-center gap-1 px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded shadow-sm transition"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Modal */}
        <AnimatePresence>
          {editingAspirant && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-md"
                initial={{ y: 50, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 50, opacity: 0, scale: 0.95 }}
              >
                <h2 className="text-2xl font-bold mb-6 text-green-700">Edit Aspirant</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {["name", "nationalId", "mobile", "email", "position", "constituency", "ward"].map(
                    (field) => (
                      <div key={field}>
                        <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                          {field}
                        </label>
                        <input
                          type={field === "email" ? "email" : "text"}
                          name={field}
                          value={formData[field] || ""}
                          onChange={handleChange}
                          placeholder={`Enter ${field}`}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                          required
                        />
                      </div>
                    )
                  )}

                  <div className="flex justify-end gap-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setEditingAspirant(null)}
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
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* <Footer /> */}
    </>
  );
};

export default EditAspirant;