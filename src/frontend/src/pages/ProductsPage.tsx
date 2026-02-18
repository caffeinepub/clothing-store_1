import ProductGrid from '../components/ProductGrid';

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Shop All</h1>
        <p className="text-lg text-muted-foreground">
          Browse our complete collection of timeless pieces
        </p>
      </div>
      
      <ProductGrid />
    </div>
  );
}
