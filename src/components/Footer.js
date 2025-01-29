// src/components/footer.js
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* Redes sociales */}
        <div className="flex space-x-4">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400"
          >
            <FacebookIcon />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400"
          >
            <TwitterIcon />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400"
          >
            <InstagramIcon />
          </a>
        </div>

        {/* Enlaces secundarios */}
        <div className="flex space-x-4 mt-4 md:mt-0">
          <Link href="/privacy-policy" className="hover:text-gray-400">
            Política de Privacidad
          </Link>
          <Link href="/terms" className="hover:text-gray-400">
            Términos y Condiciones
          </Link>
          <Link href="/contact" className="hover:text-gray-400">
            Contacto
          </Link>
        </div>

        {/* Copyright */}
        <p className="text-sm mt-4 md:mt-0">
          &copy; {new Date().getFullYear()} MoreMarket. Todos los derechos
          reservados.
        </p>
      </div>
    </footer>
  );
};

const FacebookIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M22 12C22 6.48 17.52 2 12 2S2 6.48 2 12c0 5 3.66 9.13 8.44 9.88v-6.99h-2.54v-2.89h2.54V9.62c0-2.51 1.49-3.89 3.78-3.89 1.1 0 2.25.2 2.25.2v2.48h-1.27c-1.25 0-1.64.78-1.64 1.57v1.88h2.8l-.45 2.89h-2.35V22C18.34 21.13 22 17 22 12z" />
  </svg>
);

const TwitterIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M8.29 20c7.55 0 11.68-6.29 11.68-11.68 0-.17 0-.34-.01-.51A8.36 8.36 0 0 0 22 5.92a8.19 8.19 0 0 1-2.36.65 4.15 4.15 0 0 0 1.82-2.29 8.32 8.32 0 0 1-2.63 1A4.14 4.14 0 0 0 11.43 9c0 .32.03.63.1.93A11.73 11.73 0 0 1 3 4.67a4.14 4.14 0 0 0 1.28 5.51 4.07 4.07 0 0 1-1.87-.52v.05a4.14 4.14 0 0 0 3.32 4.06 4.17 4.17 0 0 1-1.86.07 4.14 4.14 0 0 0 3.86 2.88A8.32 8.32 0 0 1 2 18.31a11.73 11.73 0 0 0 6.29 1.84" />
  </svg>
);

const InstagramIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 2.16c3.21 0 3.58.01 4.85.07 1.17.05 1.97.22 2.43.37a4.88 4.88 0 0 1 1.69 1.1 4.88 4.88 0 0 1 1.1 1.69c.15.46.32 1.26.37 2.43.06 1.27.07 1.64.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.22 1.97-.37 2.43a4.88 4.88 0 0 1-1.1 1.69 4.88 4.88 0 0 1-1.69 1.1c-.46.15-1.26.32-2.43.37-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.97-.22-2.43-.37a4.88 4.88 0 0 1-1.69-1.1 4.88 4.88 0 0 1-1.1-1.69c-.15-.46-.32-1.26-.37-2.43C2.17 15.58 2.16 15.21 2.16 12s.01-3.58.07-4.85c.05-1.17.22-1.97.37-2.43a4.88 4.88 0 0 1 1.1-1.69 4.88 4.88 0 0 1 1.69-1.1c.46-.15 1.26-.32 2.43-.37 1.27-.06 1.64-.07 4.85-.07z" />
  </svg>
);

export default Footer;
