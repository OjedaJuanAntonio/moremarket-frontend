// // src/app/layout.js
// import Navbar from '@/components/navbar';
// import Footer from '@/components/footer';
// import '../app/globals.css';

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body className="min-h-screen flex flex-col bg-gray-100">
//         <Navbar />
//         <main className="flex-grow container mx-auto mt-16 p-4">{children}</main>
//         <Footer />
//       </body>
//     </html>
//   );
// }


// src/app/layout.js
import "../app/globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-100">
        {/* AuthProvider envuelve todo */}
        <AuthProvider>
          <Navbar />
          <main className="flex-grow container mx-auto mt-16 p-4">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
