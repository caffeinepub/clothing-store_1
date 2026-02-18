import { Link } from '@tanstack/react-router';
import { Button } from './ui/button';

export default function HeroSection() {
  return (
    <section className="relative h-[700px] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/assets/generated/hero-floral.dim_1920x800.png)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background/80" />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex justify-center mb-8">
          <img 
            src="/assets/CB42A08F-1C31-4005-A8F9-78418637BFFA.png" 
            alt="Narie Logo" 
            className="h-32 w-auto drop-shadow-lg"
          />
        </div>
        <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight mb-4 text-foreground">
          Where Elegance Blooms
        </h1>
        <p className="text-xl md:text-2xl text-accent font-light italic mb-3 tracking-wide">
          Elegance in Floral
        </p>
        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          Discover our curated collection of botanical-inspired fashion
        </p>
        <Link to="/products">
          <Button size="lg" className="text-lg px-10 py-7 rounded-full shadow-lg hover:shadow-xl transition-all">
            Explore Collection
          </Button>
        </Link>
      </div>
    </section>
  );
}
