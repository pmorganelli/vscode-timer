export default async function LogSessionPage({ params }) {
  const { id } = params;

  // ----------------------------
  // Uncomment the following block to fetch from your API when available:
  /*
  const res = await fetch(`http://your-api-domain/api/sessions/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-blue-800">Session not found.</p>
      </div>
    );
  }
  const session = await res.json();
  */
  // ----------------------------

  // Testing Data (remove when API is ready)
  const session = {
    user_id: "Harrison Tun",
    time_statistics: {
      start_time: new Date(),
      session_duration_minutes: 120,
      created_at: new Date(),
      fileTimes: {
        "index.js": "30 mins",
        "app.js": "45 mins",
      },
    },
    editor_statistics: {
      keystrokeCt: 100,
      undoCt: 3,
      clickCt: 20,
      copyCutPasteCt: 15,
      deleteCt: 5,
    },
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-8">
      <h1 className="text-4xl font-bold text-blue-800 mb-8">
        {session.user_id}'s Session: #{id}
      </h1>
      <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 w-full max-w-3xl border border-blue-800">
        {/* User Information */}
        <h2 className="text-2xl font-semibold text-blue-800 mb-4 border-b border-blue-800 pb-2">
          User Information
        </h2>
        <p className="mb-6 text-blue-800">
          <strong>User ID:</strong> {session.user_id}
        </p>

        {/* Time Statistics */}
        <h2 className="text-2xl font-semibold text-blue-800 mb-4 border-b border-blue-800 pb-2">
          Time Statistics
        </h2>
        <div className="mb-6 space-y-2 text-blue-800">
          <p>
            <strong>Start Time:</strong>{" "}
            {new Date(session.time_statistics.start_time).toLocaleString()}
          </p>
          <p>
            <strong>Session Duration (minutes):</strong>{" "}
            {session.time_statistics.session_duration_minutes || "N/A"}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(session.time_statistics.created_at).toLocaleString()}
          </p>
          <div>
            <strong>File Times:</strong>
            <pre className="bg-blue-50 p-2 rounded mt-2 text-sm text-blue-800">
              {JSON.stringify(session.time_statistics.fileTimes, null, 2)}
            </pre>
          </div>
        </div>

        {/* Editor Statistics */}
        <h2 className="text-2xl font-semibold text-blue-800 mb-4 border-b border-blue-800 pb-2">
          Editor Statistics
        </h2>
        <div className="space-y-2 text-blue-800">
          <p>
            <strong>Keystrokes:</strong> {session.editor_statistics.keystrokeCt}
          </p>
          <p>
            <strong>Undo Count:</strong> {session.editor_statistics.undoCt}
          </p>
          <p>
            <strong>Click Count:</strong> {session.editor_statistics.clickCt}
          </p>
          <p>
            <strong>Copy/Cut/Paste Count:</strong>{" "}
            {session.editor_statistics.copyCutPasteCt}
          </p>
          <p>
            <strong>Delete Count:</strong> {session.editor_statistics.deleteCt}
          </p>
        </div>
      </div>
    </div>
  );
}
