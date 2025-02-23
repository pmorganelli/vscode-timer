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

  // Sort in descending order (highest timeSpent gets rank 1)
  const sortedData = leaderboardData.slice().sort((a, b) => {
    const timeA = parseInt(a.timeSpent);
    const timeB = parseInt(b.timeSpent);
    return timeB - timeA;
  });

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-8">
      <h1 className="text-4xl font-bold text-blue-800 mb-8">Leaderboard</h1>
      <div className="overflow-x-auto w-full max-w-4xl">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden border border-blue-800">
          <thead className="bg-blue-800">
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
