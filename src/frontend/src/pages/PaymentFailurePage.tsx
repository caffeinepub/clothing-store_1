import { useNavigate } from '@tanstack/react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { XCircle } from 'lucide-react';

export default function PaymentFailurePage() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <XCircle className="h-10 w-10 text-red-600" />
            </div>
            <CardTitle className="text-3xl font-serif">Payment Failed</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-lg text-muted-foreground">
              We were unable to process your payment. Please try again or use a different payment method.
            </p>
            <p className="text-sm text-muted-foreground">
              Your cart items have been saved and are waiting for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => navigate({ to: '/checkout' })}>
                Try Again
              </Button>
              <Button variant="outline" onClick={() => navigate({ to: '/cart' })}>
                View Cart
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
