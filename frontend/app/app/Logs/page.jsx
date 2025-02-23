"use client";
import { useState } from "react";
import LogRows from "../LogsRow/logsRow"; // Adjust the path if necessary

export default function LogsPage() {
  const [logs, setLogs] = useState([
    { id: "1", user: "Alice", date: "2025-02-21", timeLogged: "2 hrs" },
    { id: "2", user: "Bob", date: "2025-02-20", timeLogged: "1.5 hrs" },
    { id: "3", user: "Charlie", date: "2025-02-19", timeLogged: "3 hrs" },
  ]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Coding Logs</h1>
      <div className="overflow-x-auto w-full max-w-4xl">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-blue-500">
            <tr>
              <th className="px-6 py-3 text-left text-white font-bold">User</th>
              <th className="px-6 py-3 text-left text-white font-bold">Date</th>
              <th className="px-6 py-3 text-left text-white font-bold">
                Time Logged
              </th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <LogRows
                key={log.id}
                id={log.id}
                user={log.user}
                date={log.date}
                timeLogged={log.timeLogged}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}