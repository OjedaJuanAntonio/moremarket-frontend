"use client";

import Image from 'next/image';

const ProductCard = ({ product }) => {
    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <Image
                src={product.image || '/placeholder.jpg'}
                alt={product.name}
                width={300}
                height={200}
                className="object-cover w-full h-48"
            />
            <div className="p-4">
                <h2 className="text-xl font-bold text-gray-800 mt-2">{product.name}</h2>
                <p className="text-gray-600 mt-1">{product.description}</p>
                <p className="text-gray-900 font-semibold mt-2">Precio: ${product.price}</p>
            </div>
        </div>
    );
};

export default ProductCard;
