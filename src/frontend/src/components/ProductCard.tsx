import { Link } from '@tanstack/react-router';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import type { Product } from '../backend';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const priceInDollars = Number(product.price) / 100;

  return (
    <Link to="/product/$productId" params={{ productId: product.id }}>
      <Card className="group overflow-hidden border-0 shadow-none hover:shadow-lg transition-all duration-300">
        <div className="aspect-[4/5] overflow-hidden bg-muted">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-medium text-lg mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-2xl font-serif font-semibold mb-3">
            ${priceInDollars.toFixed(2)}
          </p>
          <div className="flex flex-wrap gap-1">
            {product.availableSizes.map((size) => (
              <Badge key={size} variant="outline" className="text-xs">
                {size}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
