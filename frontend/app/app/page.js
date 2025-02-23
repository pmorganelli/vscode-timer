import Link from "next/link";

export default function Welcome() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-[#B3E5FC] to-[#E1F5FE] p-8">
      <h1 className="text-5xl md:text-6xl font-extrabold text-blue-900 mb-8 drop-shadow-lg text-center">
        Welcome to CodeClock!
      </h1>
      <Link
        href="/Leaderboard"
        className="px-8 py-4 bg-blue-900 text-white font-semibold rounded-full shadow-lg hover:bg-blue-800 transition-colors duration-300"
      >
        View Leaderboard
      </Link>
      <br>
      </br>
       <Link
          href="/Logs"
          className="px-8 py-4 bg-blue-900 text-white font-semibold rounded-full shadow-lg hover:bg-blue-800 transition-colors duration-300"
        >
          View Logs
        </Link>
    </div>
  );
}
