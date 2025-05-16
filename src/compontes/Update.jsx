import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
const Update = ({ userData }) => {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const {id}=useParams();
  const navigation = useNavigate();

 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://wfc-software-backend.onrender.com/api/v1/fetchone/${id}`
        );
        setFormData(response.data.data);
        setLoading(false);
        console.log("Fetched user data:", response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
        toast.error("Failed to fetch user data");
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `https://wfc-software-backend.onrender.com/api/v1/update/${formData._id}`,
        formData
      );
      toast.success(response.data.message);
navigation("/");
      console.log(response.data);
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Update failed. Please check the console.");
    }
  };

  if (loading || !formData) {
    return <div className="text-center mt-10 text-lg">Loading user data...</div>;
  }
const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData((prev) => {
    const updatedData = { ...prev, [name]: value };


    if (name === "height" || name === "weight") {
      const height = parseFloat(name === "height" ? value : updatedData.height);
      const weight = parseFloat(name === "weight" ? value : updatedData.weight);

      if (height > 0 && weight > 0) {
        const bmi = weight / ((height / 100) * (height / 100));
        updatedData.bmi = bmi.toFixed(2);
      } else {
        updatedData.bmi = "";
      }
    }


    if (name === "startDate" || name === "duration") {
      const startDate = updatedData.startDate ? new Date(updatedData.startDate) : null;
      const durationMonths = parseInt(updatedData.duration, 10);

      if (startDate && !isNaN(durationMonths)) {

        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + durationMonths);

        const yyyy = endDate.getFullYear();
        const mm = String(endDate.getMonth() + 1).padStart(2, "0");
        const dd = String(endDate.getDate()).padStart(2, "0");
        updatedData.endDate = `${yyyy}-${mm}-${dd}`;
      } else {
        updatedData.endDate = "";
      }
    }

    return updatedData;
  });
};

  return (
   <div className="max-w-4xl mx-auto mt-10 p-8 bg-white shadow-lg rounded-2xl">
  <Toaster />
  <h2 className="text-2xl font-bold mb-6">Update User Information</h2>
  <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

    {[
      { label: "Name", name: "name" },
      { label: "Age", name: "age" },
      { label: "Gender", name: "gender" },
      { label: "Email", name: "email", type: "email" },
      { label: "Height", name: "height" },
      { label: "Weight", name: "weight" },
      { label: "Start Date", name: "startDate", type: "date" },
      { label: "End Date", name: "endDate", type: "date" },
      { label: "BMI", name: "bmi" },
      { label: "Phone", name: "phone" },
      { label: "Address", name: "address" },
      { label: "Pincode", name: "pincode" },
    ].map(({ label, name, type = "text" }) => (
      <div key={name} className="flex flex-col">
        <label className="mb-1 font-medium">{label}</label>
        <input
          type={type}
          name={name}
          value={type === "date" && formData[name] ? formData[name].slice(0, 10) : formData[name] || ""}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
    ))}


    <div className="flex flex-col">
      <label className="mb-1 font-medium">Blood Group</label>
      <select
        name="bloodGroup"
        value={formData.bloodGroup || ""}
        onChange={handleChange}
        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="">Select Blood Group</option>
        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
          <option key={bg} value={bg}>
            {bg}
          </option>
        ))}
      </select>
    </div>

  
    <div className="flex flex-col">
      <label className="mb-1 font-medium">Health Issues</label>
      <select
        name="issues"
        value={formData.issues || ""}
        onChange={handleChange}
        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="">Select Issue</option>
        {["Mental", "Physical", "None"].map((issue) => (
          <option key={issue} value={issue}>
            {issue}
          </option>
        ))}
      </select>
    </div>

   
    {(formData.issues === "Mental" || formData.issues === "Physical") && (
      <div className="flex flex-col">
        <label className="mb-1 font-medium">Description</label>
        <input
          type="text"
          name="description"
          value={formData.description || ""}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
    )}

    <div className="flex flex-col">
      <label className="mb-1 font-medium">Package</label>
      <select
        name="packages"
        value={formData.packages || ""}
        onChange={handleChange}
        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="">Select Package</option>
        {["Basic", "Standard", "Premium", "Student", "Woman", "Group"].map((pkg) => (
          <option key={pkg} value={pkg}>
            {pkg}
          </option>
        ))}
      </select>
    </div>

   
    <div className="flex flex-col">
      <label className="mb-1 font-medium">Duration (Months)</label>
      <select
        name="duration"
        value={formData.duration || ""}
        onChange={handleChange}
        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="">Select Duration</option>
        {["1", "3", "6", "12"].map((dur) => (
          <option key={dur} value={dur}>
            {dur}
          </option>
        ))}
      </select>
    </div>

    
    <div className="flex flex-col">
      <label className="mb-1 font-medium">Services</label>
      <select
        name="services"
        value={formData.services || ""}
        onChange={handleChange}
        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="">Select Option</option>
        {["Yes", "No"].map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
    {formData.services === "Yes" && (
      <>
      
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Personal Training</label>
          <select
            name="personalTraining"
            value={formData.personalTraining || ""}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select Duration</option>
            {["30 Days", "60 Days", "90 Days", "120 Days"].map((pt) => (
              <option key={pt} value={pt}>
                {pt}
              </option>
            ))}
          </select>
        </div>

     
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Custom Workout</label>
          <select
            name="customWorkout"
            value={formData.customWorkout || ""}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select Level</option>
            {["Beginner", "Intermediate", "Advanced"].map((cw) => (
              <option key={cw} value={cw}>
                {cw}
              </option>
            ))}
          </select>
        </div>

      
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Custom Diet</label>
          <select
            name="customDiet"
            value={formData.customDiet || ""}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select Diet</option>
            {["Basic", "Weight Loss", "Muscle Gain", "Pro Diet"].map((cd) => (
              <option key={cd} value={cd}>
                {cd}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Rehab Therapy</label>
          <select
            name="rehabTherapy"
            value={formData.rehabTherapy || ""}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select Therapy</option>
            {["Basic Recovery", "Advanced Healing", "Elite Recovery"].map((rt) => (
              <option key={rt} value={rt}>
                {rt}
              </option>
            ))}
          </select>
        </div>
      </>
    )}

    <div className="col-span-2 flex justify-end">
      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Update
      </button>
    </div>
  </form>
</div>


  );
};

export default Update;
