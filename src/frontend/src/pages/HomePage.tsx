import HeroSection from '../components/HeroSection';
import ProductGrid from '../components/ProductGrid';

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold mb-4">Featured Collection</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our carefully selected pieces that define contemporary style
          </p>
        </div>
        
        <ProductGrid />
      </section>
    </div>
  );
}
