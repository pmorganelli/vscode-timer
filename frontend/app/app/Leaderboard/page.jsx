"use client";
import Rows from "../Rows/rows";
import {useState} from "react"
export default function Leaderboard() {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const sortedData = leaderboardData.slice().sort((a,b) => {
        const timeA =  parseInt(a.timeSpent);
        const timeB = parseInt(b.timeSpent);
        return timeA - timeB;
    });
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      <h1 className="text-4xl font-bold text-blue-500 mb-8">Leaderboard</h1>
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