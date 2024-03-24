import Nav from "@components/Nav";
import "@styles/globals.css";
import Provider from "@components/Provider";

export const metadata = {
	title: "EduWallet",
};

const RootLayout = ({ children }) => {
	return (
		<html lang="en">
			<body>
				<Provider>
					<Nav />
					{children}
				</Provider>
			</body>
		</html>
	);
};

export default RootLayout;