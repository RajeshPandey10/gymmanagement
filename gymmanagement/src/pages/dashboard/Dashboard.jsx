// Dashboard.jsx
import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [userName, setUserName] = useState("User ");
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/auth/sign-in'); // Redirect to sign-in page
    }
  }, [user, navigate]);

  // Fetch user data
  useEffect(() => {
    const fetchUser  = async () => {
      try {
        const response = await api.get("/user/profile");
        setUserName(response.data.name || "User ");
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (user) {
      setUserName(user.name);
    } else {
      fetchUser ();
    }
  }, [user]);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="flex-1 p-4">
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1 bg-indigo-100 border border-indigo-200 rounded-xl p-6">
          <h2 className="text-4xl md:text-5xl text-blue-900">
            Welcome <br />
            <strong>{userName}</strong>
          </h2>
          <span className="inline-block mt-8 px-8 py-2 rounded-full text-xl font-bold text-white bg-indigo-800">
            {currentTime}
          </span>
        </div>

        <div className="flex-1 bg-blue-100 border border-blue-200 rounded-xl p-6">
          <h2 className="text-4xl md:text-5xl text-blue-900">
            Progress <br />
            <strong>75%</strong>
          </h2>
          <button className="inline-block mt-8 px-8 py-2 rounded-full text-xl font-bold text-white bg-blue-800 hover:bg-blue-900 transition-transform duration-300 hover:scale-105">
            View Progress
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-bold text-gray-800">Weekly Workouts</h3>
          <p className="text-3xl font-bold text-indigo-600">5</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-bold text-gray-800">Calories Burned</h3>
          <p className="text-3xl font-bold text-green-600">2,450</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-bold text-gray-800">Current Streak</h3>
          <p className="text-3xl font-bold text-red-600">7 Days</p>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;