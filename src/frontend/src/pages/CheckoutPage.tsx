import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import {
  useGetOrderSummary,
  useGetProducts,
  useGetCallerUserProfile,
  useSaveCallerUserProfile,
  useCreateCheckoutSession,
} from '../hooks/useQueries';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { toast } from 'sonner';
import type { ShoppingItem } from '../backend';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: orderSummary } = useGetOrderSummary();
  const { data: products } = useGetProducts();
  const { data: userProfile } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();
  const createCheckout = useCreateCheckoutSession();

  const [name, setName] = useState(userProfile?.name || '');
  const [email, setEmail] = useState(userProfile?.email || '');
  const [address, setAddress] = useState(userProfile?.shippingAddress || '');

  if (!identity) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-md mx-auto">
          <h2 className="text-2xl font-serif font-bold mb-4">Please Log In</h2>
          <p className="text-muted-foreground mb-6">
            You need to be logged in to proceed with checkout
          </p>
          <Button onClick={() => navigate({ to: '/' })}>
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  if (!orderSummary || orderSummary.items.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-md mx-auto">
          <h2 className="text-2xl font-serif font-bold mb-4">Your cart is empty</h2>
          <Button onClick={() => navigate({ to: '/products' })}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  const totalAmount = Number(orderSummary.totalAmount) / 100;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !address.trim()) {
      toast.error('Please fill in all shipping information');
      return;
    }

    try {
      // Save shipping address
      await saveProfile.mutateAsync({
        name: name.trim(),
        email: email.trim(),
        shippingAddress: address.trim(),
      });

      // Create shopping items for Stripe
      const shoppingItems: ShoppingItem[] = orderSummary.items.map((item) => {
        const product = products?.find((p) => p.id === item.productId);
        return {
          productName: product?.name || 'Product',
          productDescription: `${product?.name || 'Product'} - Size: ${item.size}`,
          priceInCents: product ? product.price : BigInt(0),
          quantity: item.quantity,
          currency: 'usd',
        };
      });

      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      const successUrl = `${baseUrl}/payment-success`;
      const cancelUrl = `${baseUrl}/payment-failure`;

      const session = await createCheckout.mutateAsync({
        items: shoppingItems,
        successUrl,
        cancelUrl,
      });

      if (!session?.url) {
        throw new Error('Stripe session missing url');
      }

      window.location.href = session.url;
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to process checkout');
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-serif font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCheckout} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Shipping Address *</Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="123 Main St, City, State, ZIP"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={createCheckout.isPending || saveProfile.isPending}
                >
                  {createCheckout.isPending || saveProfile.isPending
                    ? 'Processing...'
                    : 'Continue to Payment'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {orderSummary.items.map((item) => {
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
