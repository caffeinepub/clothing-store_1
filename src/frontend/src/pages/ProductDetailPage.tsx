import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetProducts, useAddToCart } from '../hooks/useQueries';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

export default function ProductDetailPage() {
  const { productId } = useParams({ from: '/product/$productId' });
  const navigate = useNavigate();
  const { data: products, isLoading } = useGetProducts();
  const addToCart = useAddToCart();
  
  const [selectedSize, setSelectedSize] = useState<string>('');

  const product = products?.find((p) => p.id === productId);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Product not found</p>
          <Button onClick={() => navigate({ to: '/products' })}>
            Back to Shop
          </Button>
        </div>
      </div>
    );
  }

  const priceInDollars = Number(product.price) / 100;

  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }

    try {
      await addToCart.mutateAsync({
        productId: product.id,
        size: selectedSize,
        quantity: BigInt(1),
      });
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Button
        variant="ghost"
        onClick={() => navigate({ to: '/products' })}
        className="mb-8"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Shop
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="aspect-[4/5] bg-muted rounded-lg overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col">
          <h1 className="text-4xl font-serif font-bold mb-4">{product.name}</h1>
          <p className="text-3xl font-serif font-semibold mb-6">
            ${priceInDollars.toFixed(2)}
          </p>
          
          <Card className="mb-6">
            <CardContent className="p-6">
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </CardContent>
          </Card>

          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-3">Select Size</h3>
            <div className="flex flex-wrap gap-2">
              {product.availableSizes.map((size) => (
                <Badge
                  key={size}
                  variant={selectedSize === size ? 'default' : 'outline'}
                  className="cursor-pointer px-4 py-2 text-sm"
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </Badge>
              ))}
            </div>
          </div>

          <Button
            size="lg"
            onClick={handleAddToCart}
            disabled={addToCart.isPending}
            className="w-full"
          >
            {addToCart.isPending ? 'Adding...' : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </div>
  );
}
