import Nav from "@components/Nav";
import "@styles/globals.css";
import Provider from "@components/Provider";
import { Roboto } from 'next/font/google'
 
const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
})
export const metadata = {
  title: "EduWallet",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body className={roboto.className + " bg-blue-50"}>
        <Provider>
          <Nav />
          {children}
        </Provider>
      </body>
    </html>
  );
};

export default RootLayout;
