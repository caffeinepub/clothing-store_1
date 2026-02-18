import { useNavigate } from '@tanstack/react-router';
import { useGetCart, useGetOrderSummary, useGetProducts } from '../hooks/useQueries';
import CartItem from '../components/CartItem';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const navigate = useNavigate();
  const { data: cart, isLoading: cartLoading } = useGetCart();
  const { data: orderSummary, isLoading: summaryLoading } = useGetOrderSummary();
  const { data: products } = useGetProducts();

  const isLoading = cartLoading || summaryLoading;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">Loading cart...</div>
      </div>
    );
  }

  if (!cart || cart.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-md mx-auto">
          <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-serif font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">
            Start shopping to add items to your cart
          </p>
          <Button onClick={() => navigate({ to: '/products' })}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  const totalAmount = orderSummary ? Number(orderSummary.totalAmount) / 100 : 0;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-serif font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <CartItem key={`${item.productId}-${item.size}`} item={item} />
          ))}
        </div>

        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {cart.map((item) => {
                  const product = products?.find((p) => p.id === item.productId);
                  if (!product) return null;
                  const itemTotal = (Number(product.price) / 100) * Number(item.quantity);
                  return (
                    <div key={`${item.productId}-${item.size}`} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {product.name} ({item.size}) × {item.quantity.toString()}
                      </span>
                      <span>${itemTotal.toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>
              
              <Separator />
              
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>

              <Button
                size="lg"
                className="w-full"
                onClick={() => navigate({ to: '/checkout' })}
              >
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
