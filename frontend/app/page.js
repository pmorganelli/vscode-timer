// pages/welcome.js
"use client";
import Navbar from '../components/Navbar';
import Link from "next/link";
import { useUser } from '@auth0/nextjs-auth0/client';
export default function Welcome() {
	const { user, error, isLoading } = useUser();
  let link = !user ? "api/auth/login" : "/profile";

  return (
  <div className="min-h-screen w-full relative flex flex-col items-center justify-center bg-gradient-to-r from-[#B3E5FC] to-[#E1F5FE] p-8">
      <h1 className="text-5xl md:text-6xl font-extrabold text-blue-900 mb-8 drop-shadow-lg text-center">
        Welcome to CodeClock!
      </h1>
      {(!user) ? (<a
        href={link}
        className="px-8 py-4 bg-blue-900 text-white font-semibold rounded-full shadow-lg hover:bg-blue-800 transition-colors duration-300"
      >
        Login
      </a>)
      :
      (<Link
        href={link}
        className="absolute top-4 right-4 px-4 py-2 bg-blue-900 text-white font-semibold rounded-full shadow-lg hover:bg-blue-800 transition-colors duration-300"
      >
        My Profile
      </Link>)}
    </div>
  );
}
