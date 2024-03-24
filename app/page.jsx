"use client";

import Image from "next/image";
import { signIn, useSession, getProviders } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const FrontPage = () => {
	const router = useRouter();
	const { data: session, status } = useSession();
	const [providers, setProviders] = useState(null);

	useEffect(() => {
		const setup_providers = async () => {
			const response = await getProviders();
			setProviders(response);
		};
		setup_providers();
	}, []);

	if (status == "loading") {
		return <div className="loading">Loading...</div>;
	} else if (status == "authenticated") {
		router.push("/dashboard");
	} else {
		return (
			<div>
				<div className="banner-cont flex flex-row justify-center items-center">
					<div className="welcome-msg">EduWallet</div>
					<div className="slogan-msg">Master your school finances</div>
					{providers &&
						Object.values(providers).map((provider) => (
							<button
								key={provider.name}
								className="started-btn"
								onClick={() => {
									signIn(provider.id, { callbackUrl: "/dashboard" });
								}}
								href="/dashboard"
							>
								Get Started
							</button>
						))}
				</div>
				<div className="feat-cont flex flex-row justify-center items-center">
					<div>
						<Image src="/notes.png" width={100} height={100} />
						<p>Record all your educational finances with ease</p>
					</div>
					<div>
						<Image src="/pie.png" width={100} height={100} />
						<p>See your expenses and earnings graphically represented</p>
					</div>
					<div>
						<Image src="/graph.png" width={100} height={100} />
						<p>See how your total balance changes over time</p>
					</div>
				</div>
			</div>
		);
	}
};

export default FrontPage;