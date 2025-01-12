import Image from 'next/image';
import Link from 'next/link';

const ProductCard = ({ product }) => {
    // Determina el estado del producto y el texto del botón
    const getButtonText = () => {
        if (product.status === 'auction') return 'Ofertar';
        if (product.status === 'sold') return 'Vendido';
        return 'Ver más';
    };

    // Determina el color de la etiqueta de estado
    const getStatusColor = () => {
        switch (product.status) {
            case 'new':
                return 'bg-green-500';
            case 'used':
                return 'bg-yellow-500';
            case 'auction':
                return 'bg-blue-500';
            case 'sold':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <Image
                src={product.image}
                alt={product.name}
                width={300}
                height={200}
                className="object-cover w-full h-48"
            />
            <div className="p-4">
                {/* Etiqueta de estado */}
                <span
                    className={`inline-block px-3 py-1 text-sm font-semibold text-white rounded-full ${getStatusColor()}`}
                >
                    {product.status === 'auction' ? 'En Subasta' : product.status === 'new' ? 'Nuevo' : 'Usado'}
                </span>

                {/* Información del producto */}
                <h2 className="text-xl font-bold text-gray-800 mt-2">{product.name}</h2>
                <p className="text-gray-600 mt-1">{product.description}</p>
                <p className="text-gray-900 font-semibold mt-2">${product.price}</p>

                {/* Botón de acción */}
                <Link
                    href={`/product/${product.id}`}
                    className="inline-block mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                    {getButtonText()}
                </Link>
            </div>
        </div>
    );
};

export default ProductCard;
