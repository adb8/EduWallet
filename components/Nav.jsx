"use client";

import Link from "next/link";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";
import { useEffect, useState } from "react";

const Nav = () => {
	const { data: session, status } = useSession();
	const [providers, setProviders] = useState(null);

	useEffect(() => {
		const setup_providers = async () => {
			const response = await getProviders();
			setProviders(response);
		};
		setup_providers();
	}, []);

	if (status === "loading") {
		return <div className="loading">Loading...</div>;
	} else {
		if (session?.user) {
			return (
				<div className="navbar-cont flex flex-row justify-center items-center">
					<Link className="logo-link" href="/dashboard">
						EduWallet
					</Link>
					<Link href="/dashboard">Dashboard</Link>
					<Link className="signout-link" href="/dashboard" onClick={signOut}>
						Sign Out
					</Link>
				</div>
			);
		} else if (!session?.user) {
			return (
				<div className="navbar-cont flex flex-row justify-center items-center">
					<Link className="logo-link" href="/">
						EduWallet
					</Link>
					<Link href="/">Home</Link>
					{providers &&
						Object.values(providers).map((provider) => (
							<Link
								key={provider.name}
								className="signin-link"
								href="/"
								onClick={() => {
									signIn(provider.id, { callbackUrl: "/dashboard" });
								}}
							>
								Sign In
							</Link>
						))}
				</div>
			);
		}
	}
};

export default Nav;