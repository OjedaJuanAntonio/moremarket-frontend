import Link from 'next/link';

const Navbar = () => {
    return (
        <nav className="bg-blue-600 p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">MoreMarket</h1>
                <ul className="flex space-x-6">
                    <li>
                        <Link href="/">
                            Inicio
                        </Link>
                    </li>
                    <li>
                        <Link href="/subastas">
                            Subastas
                        </Link>
                    </li>
                    <li>
                        <Link href="/tienda">
                            Tienda
                        </Link>
                    </li>
                    <li>
                        <Link href="/perfil">
                            Mi Perfil
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
