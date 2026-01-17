"use client";

import Navbar from '@/components/Navbar';
import React from 'react';
import { useState, useEffect } from 'react';

const Page = () => {
  const [showForm, setShowForm] = useState(false);
  const [counties, setCounties] = useState([]);
  const [selectedCounty, setSelectedCounty] = useState("");
  const [constituencies, setConstituencies] = useState([]);
  const [selectedConstituency, setSelectedConstituency] = useState("");
  const [wards, setWards] = useState([]);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    nationalId: "",
    mobile: "",
    email: "",
    county: "",
    constituency: "",
    ward: "",
    position: "", // Added position field
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchCounties = async () => {
      try {
        const response = await fetch("/county.json");
        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();
        console.log("Fetched Counties:", data);

        setCounties(data);
      } catch (error) {
        console.error("Error fetching counties:", error);
      }
    };

    fetchCounties();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target; // Destructure name and value from e.target

    // Update formData
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Update constituencies and wards based on the selected county
    if (name === "county") {
      const selectedCounty = counties.find((county) => county.county_name === value);
      setConstituencies(selectedCounty ? selectedCounty.constituencies : []);
      setWards([]);
      setFormData((prev) => ({ ...prev, constituency: "", ward: "" }));
    }

    // Update wards based on the selected constituency
    if (name === "constituency") {
      const selectedConstituency = constituencies.find(
        (consti) => consti.constituency_name === value
      );
      setWards(selectedConstituency ? selectedConstituency.wards : []);
      setFormData((prev) => ({ ...prev, ward: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data Before Validation:", formData); // Debugging
    console.log("Submitting to API:", formData);
    // Ensure all required fields are filled
    if (
      !formData.name ||
      !formData.nationalId ||
      !formData.mobile ||
      !formData.email ||
      !formData.position ||
      !formData.county ||
      !formData.constituency ||
      !formData.ward 
    // Added position validation
    ) {
      setMessage("Please fill in all required fields.");
      console.error("Missing fields:", formData);
      return;
    }

    try {
      const response = await fetch("/api/aspirantnew", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      let data;
      try {
        data = await response.json(); // Ensure response is JSON
      } catch (jsonError) {
        console.error("Invalid JSON response", jsonError);
        setMessage("Unexpected server response.");
        return;
      }

      if (response.ok) {
        setShowSuccessPopup(true);
        setFormData({
          name: "",
          nationalId: "",
          mobile: "",
          email: "",
          position: "",
          county: "",
          constituency: "",
          ward: "",
          // Reset position field
        });
        setConstituencies([]);
        setWards([]);
      } else {
        setMessage(data.error || "Registration failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <Navbar />

      <div className="mt-8 mx-auto max-w-2xl text-center bg-white p-8 rounded-lg shadow-lg">
        {/* Heading */}
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Become a FreeKenya Aspirant
        </h2>

        {/* Paragraphs */}
        <p className="text-gray-700 mb-4">
          Join the movement for a better Kenya by stepping up as a leader in your community. 
          As an aspirant, you have the opportunity to make a real difference and drive positive change.
        </p>
        <p className="text-gray-700 mb-6">
          Whether you&aposre passionate about education, healthcare, or economic development, 
          your voice matters. Register today and let&aposs build a brighter future together.
        </p>

        {/* Call-to-Action Button */}
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
        >
          Register as an Aspirant Here
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold text-gray-900">
              Register as an Aspirant Under Freekenya Movement
            </h2>
            <form className="mt-4" onSubmit={handleSubmit}>
              {message && (
    <p className="text-red-600 text-sm mt-2">{message}</p>
  )}
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full p-2 border rounded mb-2"
              />
              <input
                type="text"
                name="nationalId"
                value={formData.nationalId}
                onChange={handleChange}
                placeholder="National ID Number"
                className="w-full p-2 border rounded mb-2"
              />
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Mobile Number"
                className="w-full p-2 border rounded mb-2"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full p-2 border rounded mb-2"
              />

              {/* Position Dropdown */}
              <select
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="w-full p-2 border rounded mb-2"
              >
                <option value="">Select Position</option>
                <option value="Presidency">Presidency</option>
                <option value="Governor">Governor</option>
                <option value="Senator">Senator</option>
                <option value="MP">Member of Parliament (MP)</option>
                <option value="Women Rep">Women Representative</option>
                <option value="MCA">Member of County Assembly (MCA)</option>
              </select>

              <select
                name="county"
                value={formData.county}
                onChange={(e) => {
                  const countyName = e.target.value;
                  setSelectedCounty(countyName);
                  const county = counties.find((c) => c.county_name === countyName);
                  setConstituencies(county ? county.constituencies : []);
                  setSelectedConstituency("");
                  setWards([]);
                  setFormData((prev) => ({ ...prev, county: countyName, constituency: "", ward: "" }));
                }}
                className="w-full p-2 border rounded mb-2"
              >
                <option value="">Select County</option>
                {counties.map((county, index) => (
                  <option key={index} value={county.county_name}>
                    {county.county_name}
                  </option>
                ))}
              </select>

              <select
                name="constituency"
                value={formData.constituency}
                onChange={(e) => {
                  const constituencyName = e.target.value;
                  setSelectedConstituency(constituencyName);
                  const constituency = constituencies.find((c) => c.constituency_name === constituencyName);
                  setWards(constituency ? constituency.wards : []);
                  setFormData((prev) => ({ ...prev, constituency: constituencyName, ward: "" }));
                }}
                className="w-full p-2 border rounded mb-2"
              >
                <option value="">Select Constituency</option>
                {constituencies.map((constituency, index) => (
                  <option key={index} value={constituency.constituency_name}>
                    {constituency.constituency_name}
                  </option>
                ))}
              </select>

              <select
                name="ward"
                value={formData.ward}
                onChange={handleChange}
                className="w-full p-2 border rounded mb-2"
              >
                <option value="">Select Ward</option>
                {wards.map((ward, index) => (
                  <option key={index} value={ward}>
                    {ward}
                  </option>
                ))}
              </select>

              <div className="flex justify-between mt-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSuccessPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80">
          <div className="bg-green-500 text-white p-6 rounded-lg shadow-lg w-80 text-center">
            <h2 className="text-xl font-bold"> Registration Successful!</h2>
            <p className="mt-2">
              You have successfully registered as an Aspirant under FreeKenya in the 2027 Elections.
            </p>
            <button
              onClick={() => setShowSuccessPopup(false)}
              className="mt-4 bg-white text-green-700 px-4 py-2 rounded-lg font-semibold shadow-md hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Page;
