import ProductCard from '../components/ProductCard';

const sampleProducts = [
    {
        id: 1,
        name: 'Laptop Gamer',
        price: 1200,
        image: '/images/laptop.jpg',
        description: 'Laptop de alto rendimiento para gaming y trabajo.',
        status: 'new',
    },
    {
        id: 2,
        name: 'Smartphone',
        price: 800,
        image: '/images/smartphone.jpg',
        description: 'Smartphone usado en excelente estado.',
        status: 'used',
    },
    {
        id: 3,
        name: 'Televisor 4K',
        price: 900,
        image: '/images/tv.jpg',
        description: 'Televisor de alta definición con resolución 4K.',
        status: 'auction',
    },
    {
        id: 4,
        name: 'Tablet',
        price: 400,
        image: '/images/tablet.jpg',
        description: 'Tablet vendida recientemente.',
        status: 'sold',
    },
];

export default function Home() {
    return (
        <main className="min-h-screen bg-gray-100 p-10">
            <h1 className="text-4xl font-bold text-center mb-10">Productos en venta</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sampleProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </main>
    );
}
