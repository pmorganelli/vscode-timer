"use client";
import { useUser } from "@clerk/nextjs";

const UserProfile = () => {
	const { user, isLoaded, isSignedIn } = useUser();

	if (!isLoaded) return <div>Loading...</div>;
	if (!isSignedIn) return <RedirectToSignIn />;

	return (
		<div>
			<h1>User Profile</h1>
			<p>
				Full Name: {user.firstName} {user.lastName}
			</p>
			<p>Email: {user.email}</p>
		</div>
	);
};

export default UserProfile;
