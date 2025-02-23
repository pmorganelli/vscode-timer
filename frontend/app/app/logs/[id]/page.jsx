export default function LogSessionPage({ params }) {
    const { id } = params;
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Session Details: {id}
        </h1>
        <p className="text-lg text-gray-700">
          Detailed information for session {id} goes here.
        </p>
      </div>
    );
  }