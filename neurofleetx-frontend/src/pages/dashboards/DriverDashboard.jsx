import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const DriverDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
  if (user && user.role === "Driver") {
    axios.get("http://localhost:8080/api/optimize/plans")
      .then(res => {
        let plans = res.data;

        // Plans assigned to this driver
        let assignedPlans = plans.filter(p =>
          p.jobs.some(j => Number(j.assignedDriverId) === Number(user.id))
        );

        if (assignedPlans.length === 0) {
          setJobs([]);
          return;
        }

        // Sort by time (latest first)
        assignedPlans.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Latest plan
        const latestPlan = assignedPlans[0];

        const myJobs = latestPlan.jobs.filter(
          j => Number(j.assignedDriverId) === Number(user.id)
        );

        setJobs(myJobs);
      });
  }
}, [user]);


  if (!user || user.role.toLowerCase() !== "driver") {
    return (
      <div className="min-h-screen flex items-center justify-center text-4xl text-red-600">
        Access Denied. Driver Login Required.
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-5xl text-orange-600">
        No deliveries assigned yet.
      </div>
    );
  }

  return (
    <div className="min-h-screen p-10">
      <h1 className="text-5xl font-bold mb-10 text-purple-700">
        Driver Dashboard — {jobs.length} Deliveries
      </h1>

      <ul className="space-y-4">
        {jobs.map(job => (
          <li key={job.id} className="p-4 bg-white shadow rounded-xl">
            <h2 className="font-bold text-xl">{job.customerName}</h2>
            <p>{job.address}</p>
            <p>Stop #{job.sequenceInRoute}</p>
            <p>Vehicle: {job.assignedVehicleRegNo}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DriverDashboard;
