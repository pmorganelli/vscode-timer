'use client';

import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Link from 'next/link';

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setUserData({
        name: 'Alex Johnson',
        totalTime: 30004500, // Total coding time in ms
        sessions: [
          { id: 1, date: '2023-02-15', thinkingTime: 30, codingTime: 70 },
          { id: 2, date: '2023-02-16', thinkingTime: 100, codingTime: 80 },
          { id: 3, date: '2023-02-17', thinkingTime: 25, codingTime: 75 },
          { id: 4, date: '2023-02-18', thinkingTime: 35, codingTime: 65 },
          { id: 5, date: '2023-02-19', thinkingTime: 15, codingTime: 85 },
        ],
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) return <p className="text-center mt-10 text-lg text-blue-800">Loading profile...</p>;

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  const hours = Math.floor(userData.totalTime / 3600000);
  const minutes = Math.floor((userData.totalTime % 3600000) / 60000);
  const seconds = Math.floor((userData.totalTime % 60000) / 1000);

  // Custom tick renderer to make dates clickable
  const renderXAxisTick = ({ x, y, payload }) => {
    const session = userData.sessions.find(s => s.date === payload.value);
    return (
      <g transform={`translate(${x},${y + 10})`}> {/* Adjust y position here */}
        <Link href={`/logs/${session.id}`} className="text-blue-600 hover:underline">
          <text textAnchor="middle" fill="#1E40AF" dy={10}> {/* Adjust dy for additional downward shift */}
            {payload.value}
          </text>
        </Link>
      </g>
    );
  };

  return (
    <div className="w-full min-h-screen flex flex-col justify-start pt-0 bg-gradient-to-b from-blue-200 to-blue-400 shadow-xl text-center border border-blue-300 relative">
      <div className="w-28 h-28 rounded-full mx-auto mt-10 mb-6 bg-gray-400 flex items-center justify-center text-white text-3xl font-bold shadow-md">
        {getInitials(userData.name)}
      </div>
      <h1 className="text-3xl font-extrabold text-blue-900">{userData.name}</h1>
      <p className="text-blue-800 font-bold font-mono text-lg mt-2">
        Total Coding Time:{' '}
        <span className="font-mono">
          {hours} hr{' '}
          {minutes} min{' '}
          {seconds} sec
        </span>
      </p>
      
      <h2 className="text-2xl font-mono mt-8 text-blue-900">Last 5 Coding Sessions</h2>
      <div className="p-4 rounded-lg shadow-md mt-4 mx-4">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={userData.sessions} style={{ backgroundColor: 'transparent' }}>
            <XAxis dataKey="date" stroke="#1E40AF" tick={renderXAxisTick} />
            <YAxis 
              stroke="#1E40AF" 
              label={{ value: 'Minutes', angle: -90, position: 'insideLeft', offset: 0, fill: "#1E40AF" }} // Custom Y-axis label
            />
            <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '8px' }} />
            <Bar dataKey="thinkingTime" fill="#93C5FD" stackId="a" />
            <Bar dataKey="codingTime" fill="#1E40AF" stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* View All My Logs Button */}
        <Link href="/logs" className="mt-6 px-6 py-3 bg-blue-900 text-white font-semibold rounded-lg shadow-md hover:bg-blue-800 transition duration-300">
        View All My Logs
        </Link>
    </div>
  );
}
