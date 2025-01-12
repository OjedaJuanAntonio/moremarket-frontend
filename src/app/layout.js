// import '@/location/app/globals.css';
import './globals.css';
import Navbar from '../components/Navbar';

export const metadata = {
  title: 'MoreMarket',
  description: 'Subastas en tiempo real y tienda virtual',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
