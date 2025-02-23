// components/Navbar.js
"use client";
import Link from "next/link";
import {
	ClerkProvider,
	SignInButton,
	SignUpButton,
	SignedIn,
	SignedOut,
	UserButton,
} from "@clerk/nextjs";
export default function Navbar() {
	return (
		<nav className="bg-blue-900 p-4 shadow-md">
			<div className="container mx-auto flex justify-between items-center">
				<div className="text-white font-bold text-xl">CodeClock</div>
				<div className="space-x-4">
					<SignedOut>
						<SignInButton />
						<SignUpButton />
					</SignedOut>
					<SignedIn>
						<UserButton />
					</SignedIn>
					<Link
						href="/"
						className="text-white hover:text-blue-300 transition-colors duration-300"
					>
						Home
					</Link>
					<Link
						href="/leaderboard"
						className="text-white hover:text-blue-300 transition-colors duration-300"
					>
						Leaderboard
					</Link>
					<Link
						href="/logs"
						className="text-white hover:text-blue-300 transition-colors duration-300"
					>
						Logs
					</Link>
					<Link
						href="/profile"
						className="text-white hover:text-blue-300 transition-colors duration-300"
					>
						My Profile
					</Link>
				</div>
			</div>
		</nav>
	);
}
