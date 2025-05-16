import React, { useEffect, useState } from "react";
import axios from "axios";

import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
export const UserDetails = () => {
  const [userData, setUserData] = useState([]);

 useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get("https://wfc-software-backend.onrender.com/api/v1/fetch");
      const rawData = response.data.data || [];
      const processedData = rawData.map(user => {
        const updatedUser = {};
        for (const key in user) {
          if (user.hasOwnProperty(key)) {
            let value = user[key];
            if (value === "" || value === null || value === undefined) {
              value = "None";
            }
            if (key.toLowerCase().includes("date") && typeof value === "string" && value.includes("T")) {
              value = value.split("T")[0];
            }
            updatedUser[key] = value;
          }
        }
        return updatedUser;
      });
      setUserData(processedData);
      console.log("Fetched and Processed:", processedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  fetchData();
}, []);

  

  const handleDelete = async (id) => {
    try {
     await axios.post(
               `https://wfc-software-backend.onrender.com/api/v1/delete/${id}`
             );
      setUserData(userData.filter(user => user._id !== id));
      console.log("Deleted user ID:", id);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const headers = [
    "sno",
    "Name",
    "Age",
    "Gender",
    "BMI",
    "Issue",
    "Description",
    "Package",
    "Duration",
    "Start Date ",
    "End Date",
    "Service",
    "personal Training",
    "custom Workout",
    "customDiet",
    "rehabTherapy",
    "Address",
    "Edit",
    "Delete",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r mt-[70px] from-blue-100 to-indigo-100 p-4 flex items-center justify-center">
      <div className="w-full max-w-7xl bg-white shadow-2xl rounded-xl p-6 md:p-10">
        <h1 className="text-3xl font-bold text-center text-indigo-800 mb-8">
          User Details
        </h1>

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden text-sm md:text-base">
            <thead className="bg-indigo-600 text-white">
              <tr>
                {headers.map((header, index) => (
                  <th
                    key={index}
                    className="px-4 py-3 border-r last:border-r-0 whitespace-nowrap text-left"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white text-gray-800">
              {userData.length > 0 ? (
                userData.map((user,index) => (
                  <tr
                    key={user._id}
                    className="hover:bg-indigo-50 transition-all duration-200"
                  >
                    <td className="px-4 py-3 border border-gray-200">{index+1}</td>
                    <td className="px-4 py-3 border border-gray-200">{user.name}</td>
                    <td className="px-4 py-3 border border-gray-200">{user.age}</td>
                    <td className="px-4 py-3 border border-gray-200">{user.gender}</td>
                    <td className="px-4 py-3 border border-gray-200">{user.bmi}</td>
                    <td className="px-4 py-3 border border-gray-200">{user.issues}</td>
                    <td className="px-4 py-3 border border-gray-200">{user.description}</td>
                    <td className="px-4 py-3 border border-gray-200">{user.packages}</td>
                    <td className="px-4 py-3 border border-gray-200">{user.duration} Months</td>
                    <td className="px-4 py-3 border border-gray-200">{user.startDate}</td>
                    <td className="px-4 py-3 border border-gray-200">{user.endDate} </td>
                    <td className="px-4 py-3 border border-gray-200">{user.services}</td>
                    <td className="px-4 py-3 border border-gray-200">{user.personalTraining}</td>
                    <td className="px-4 py-3 border border-gray-200">{user.customWorkout}</td>
                    <td className="px-4 py-3 border border-gray-200">{user.customDiet}</td>
                    <td className="px-4 py-3 border border-gray-200">{user.rehabTherapy}</td>
                    <td className="px-4 py-3 border border-gray-200">{user.address}</td>
                    <td className="px-4 py-3 border border-gray-200">
                      <Link to={`/update/${user._id}`}>
                        <button className="bg-green-500 hover:bg-green-600 cursor-pointer text-white px-3 py-1 rounded">
                         <FaEdit />
                        </button>
                      </Link>
                    </td>
                    <td className="px-4 py-3 border border-gray-200">
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="bg-red-500 hover:bg-red-600 cursor-pointer text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={headers.length}
                    className="text-center py-6 text-gray-500"
                  >
                    No user data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
