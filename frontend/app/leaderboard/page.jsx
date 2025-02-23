"use client";
import { useState } from "react";
import Rows from "../rows/rows";

export default function Leaderboard() {
  // Testing data for the leaderboard (replace with API data when available)
  const [leaderboardData, setLeaderboardData] = useState([
    { id: "1", name: "Alice", timeSpent: "120" },
    { id: "2", name: "Bob", timeSpent: "90" },
    { id: "3", name: "Charlie", timeSpent: "180" },
  ]);

  // Sort in descending order so the user with the highest timeSpent is ranked first.
  const sortedData = leaderboardData.slice().sort((a, b) => {
    return parseInt(b.timeSpent) - parseInt(a.timeSpent);
  });

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Leaderboard</h1>
      <div className="overflow-x-auto w-full max-w-4xl">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-blue-500">
            <tr>
              <th className="px-6 py-3 text-left text-white font-bold">Rank</th>
              <th className="px-6 py-3 text-left text-white font-bold">Name</th>
              <th className="px-6 py-3 text-left text-white font-bold">Time Spent</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((rowData, index) => (
              <Rows
                key={rowData.id}
                rank={index + 1}
                name={rowData.name}
                timeSpent={rowData.timeSpent}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
