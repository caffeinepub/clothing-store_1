import { Outlet, Link, useNavigate } from '@tanstack/react-router';
import { ShoppingCart, User } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCart } from '../hooks/useQueries';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import AdminPanel from './AdminPanel';
import ProfileSetup from './ProfileSetup';

export default function Layout() {
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const navigate = useNavigate();
  const { data: cart } = useGetCart();
  
  const isAuthenticated = !!identity;
  const cartItemCount = cart?.reduce((sum, item) => sum + Number(item.quantity), 0) || 0;

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-24 items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src="/assets/CB42A08F-1C31-4005-A8F9-78418637BFFA.png" 
                alt="Narie Logo" 
                className="h-16 w-auto"
              />
              <div className="flex flex-col">
                <span className="text-2xl font-serif font-bold tracking-tight text-foreground">
                  NARIE
                </span>
                <span className="text-xs font-light tracking-wide text-muted-foreground italic">
                  Elegance in Floral
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Home
              </Link>
              <Link
                to="/products"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Shop
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleAuth}
                disabled={isLoggingIn}
                className="relative"
              >
                <User className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate({ to: '/cart' })}
                className="relative"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <ProfileSetup />
      <AdminPanel />

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border/40 bg-muted/30 mt-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img 
                  src="/assets/CB42A08F-1C31-4005-A8F9-78418637BFFA.png" 
                  alt="Narie Logo" 
                  className="h-10 w-auto"
                />
                <h3 className="text-lg font-serif font-semibold">NARIE</h3>
              </div>
              <p className="text-sm text-muted-foreground italic mb-2">
                Elegance in Floral
              </p>
              <p className="text-sm text-muted-foreground">
                Botanical-inspired fashion for the refined wardrobe.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/products" className="hover:text-foreground transition-colors">
                    All Products
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Support</h4>
              <p className="text-sm text-muted-foreground">
                Questions? Contact us anytime.
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} Narie. Built with ❤️ using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
