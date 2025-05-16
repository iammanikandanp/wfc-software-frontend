import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
export const Register = () => {
  const [step, setStep] = useState(1);
  const [bmiStatus, setBmiStatus] = useState("");
  const [formData, setFormData] = useState({
    name: "", age: "", gender: "", email: "",
    height: "", weight: "", bmi: "",
    bloodGroup: "", issues: "", description: "",
    packages: "", duration: "", services: "",
    personalTraining: "", customWorkout: "", customDiet: "", rehabTherapy: "",
    profession: "", phone: "", address: "", pincode: "",startDate: "",
  endDate: ""
  });

const navigate = useNavigate();

  useEffect(() => {
    const { height, weight } = formData;
    if (height && weight) {
      const h = parseFloat(height) / 100;
      const w = parseFloat(weight);
      const bmi = w / (h * h);
      const bmiVal = bmi.toFixed(1);
      let status = "";
      if (bmi < 18.5) status = "Underweight";
      else if (bmi < 24.9) status = "Normal";
      else if (bmi < 29.9) status = "Overweight";
      else status = "Obese";
      setFormData(prev => ({ ...prev, bmi: bmiVal }));
      setBmiStatus(status);
    }
  }, [formData.height, formData.weight]);
useEffect(() => {
  if (formData.startDate && formData.duration) {
    const start = new Date(formData.startDate);
    const durationMonths = parseInt(formData.duration, 10);
    const end = new Date(start.setMonth(start.getMonth() + durationMonths));
    
    const formattedEnd = end.toISOString().split('T')[0];

    setFormData(prev => ({
      ...prev,
      endDate: formattedEnd
    }));
  }
}, [formData.startDate, formData.duration]);
const [isSubmitting, setIsSubmitting] = useState(false);
const getCurrentFields = () => {
  switch (step) {
    case 1: 
      return ["name", "age", "gender", "email"];
    case 2: 
      return ["height", "weight", "bmi"];
    case 3:
    return formData.issues === "Mental" || formData.issues === "Physical"
      ? ["bloodGroup", "issues", "description"]
      : ["bloodGroup", "issues"];

    case 4: 
    return ["profession", "phone", "address", "pincode"];
   case 5:
  return [
    "packages",
    "duration",
    "startDate",
    "services",
    ...(formData.services === "Yes"
      ? ["personalTraining", "customWorkout", "customDiet", "rehabTherapy"]
      : [])
  ];

    default: 
      return [];
  }
};


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
const isValidEmail = email =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidPhone = phone =>
  /^\d{10}$/.test(phone);

 const handleNext = () => {
  const currentFields = getCurrentFields();
  const isValid = currentFields.every(field => formData[field]?.toString().trim() !== "");

  if (!isValid) {
    toast.error("Please fill all required fields");
    return;
  }


  if (step === 1 && !isValidEmail(formData.email)) {
    toast.error("Please enter a valid email address");
    return;
  }

  
  if (step === 4 && !isValidPhone(formData.phone)) {
    toast.error("Please enter a valid 10-digit phone number");
    return;
  }

  if (step < 5) setStep(prev => prev + 1);
};

  const handleBack = () => {
    if (step > 1) setStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {

      const response = await axios.post("http://localhost:5000/api/v1/register", formData);
      if (response) toast.success(response.data.message);
      navigate("/");
    } catch {
      toast.error("Submission failed!");
    }
    finally {
      setIsSubmitting(false);
      
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
          <h3 className="text-gray-600 font-semibold text-2xl sm:text-md ">Basic Details</h3>
            <Input label="Name" name="name" value={formData.name} onChange={handleChange} />
            <Input label="Age" name="age" value={formData.age} onChange={handleChange} type="number" />
            <Select label="Gender" name="gender" value={formData.gender} onChange={handleChange} options={["Male", "Female", "Other"]} />
            <Input label="Email" name="email" value={formData.email} onChange={handleChange} type="email" />
          </>
        );
      case 2:
        return (
          <>
          <h3 className="text-gray-600 font-semibold text-2xl sm:text-md">Weight Details</h3>

            <Input label="Height (cm)" name="height" value={formData.height} onChange={handleChange} type="number" />
            <Input label="Weight (kg)" name="weight" value={formData.weight} onChange={handleChange} type="number" />
            <Input label="BMI" name="bmi" value={formData.bmi} readOnly />
            {formData.bmi && (
              <p className={`text-sm font-medium mt-1 ${bmiStatus === "Underweight" ? "text-blue-500" : bmiStatus === "Normal" ? "text-green-500" : bmiStatus === "Overweight" ? "text-yellow-500" : "text-red-500"}`}>
                Status: {bmiStatus}
              </p>
            )}
          </>
        );
      case 3:
  return (
    <>
          <h3 className="text-gray-600 font-semibold text-2xl sm:text-md">Medical Details</h3>

      <Select
        label="Blood Group"
        name="bloodGroup"
        value={formData.bloodGroup}
        onChange={handleChange}
        options={["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]}
      />

      <Select
        label="Health Issues"
        name="issues"
        value={formData.issues}
        onChange={handleChange}
        options={["Mental", "Physical", "None"]}
      />

       {(formData.issues === "Mental" || formData.issues === "Physical") && (
        <Input
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      )}
    </>
  );

      case 4:
        return (
          <>
          <h3 className="text-gray-600 font-semibold text-2xl sm:text-md">Contact Details</h3>
            <Input label="Profession" name="profession" value={formData.profession} onChange={handleChange} />
            <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
            <Input label="Address" name="address" value={formData.address} onChange={handleChange} />
            <Input label="Pincode" name="pincode" value={formData.pincode} onChange={handleChange} />
          </>
        );
       case 5:
  return (
    <>
          <h3 className="text-gray-600 font-semibold text-2xl sm:text-md">Membership Details</h3>
      <Select
        label="Package"
        name="packages"
        value={formData.packages}
        onChange={handleChange}
        options={["Basic", "Standard", "Premium", "Student", "Woman", "Group"]}
      />
      <Select
        label="Duration (Months)"
        name="duration"
        value={formData.duration}
        onChange={handleChange}
        options={["1", "3", "6", "12"]}
      />
      <Input
  label="Start Date"
  type="date"
  name="startDate"
  value={formData.startDate}
  onChange={handleChange}
/>

<Input
  label="End Date"
  type="date"
  name="endDate"
  value={formData.endDate}
  readOnly
/>

      <Select
        label="Require Services?"
        name="services"
        value={formData.services}
        onChange={handleChange}
        options={["Yes", "No"]}
      />
      {formData.services === "Yes" && (
        <>
          <Select
            label="Personal Training"
            name="personalTraining"
            value={formData.personalTraining}
            onChange={handleChange}
            options={["30 Days", "60 Days", "90 Days", "120 Days"]}
          />
          <Select
            label="Customized Workout"
            name="customWorkout"
            value={formData.customWorkout}
            onChange={handleChange}
            options={["Beginner", "Intermediate", "Advanced"]}
          />
          <Select
            label="Customized Diet"
            name="customDiet"
            value={formData.customDiet}
            onChange={handleChange}
            options={["Basic", "Weight Loss", "Muscle Gain", "Pro Diet"]}
          />
          <Select
            label="Rehab Therapy"
            name="rehabTherapy"
            value={formData.rehabTherapy}
            onChange={handleChange}
            options={["Basic Recovery", "Advanced Healing", "Elite Recovery"]}
          />
        </>
      )}
    </>
  );

      default:
        return null;
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-between mb-8">
      {[1, 2, 3, 4, 5].map((num) => (
        <div key={num}
          className={`flex-1 text-center py-2 rounded-full mx-1 text-sm
          ${step === num
              ? "bg-blue-600 text-white"
              : step > num
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-600"}`}>
          Step {num}
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto p-6  bg-white shadow-xl  rounded-xl mt-[100px]">
      <Toaster position="top-right" />
      <StepIndicator />
      <form onSubmit={handleSubmit} className="space-y-5">
        {renderStep()}
        <div className="flex justify-between pt-6">
          {step > 1 && (
            <button type="button" onClick={handleBack} className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600">Back</button>
          )}
          {step < 5 ? (
            <button type="button" onClick={handleNext} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Next</button>
          ) : (
   <button type="submit" disabled={isSubmitting}>
  {isSubmitting ? "Submitting..." : "Finish"}
</button>
          )}
        </div>
      </form>
    </div>
  );
};

const Input = ({ label, ...props }) => (
  <div className="mb-3">
    <label className="block mb-1 text-sm font-medium text-gray-700">{label}</label>
    <input
      className={`w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${props.readOnly ? "bg-gray-100" : ""}`}
      {...props}
      required={!props.readOnly}
    />
  </div>
);

const Select = ({ label, name, value, onChange, options }) => (
  <div className="mb-3">
    <label className="block mb-1 text-sm font-medium text-gray-700">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    >
      <option value="">Select</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);
