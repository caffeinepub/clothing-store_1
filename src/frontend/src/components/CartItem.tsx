import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { useUpdateCartItem, useRemoveCartItem, useGetProducts } from '../hooks/useQueries';
import type { CartItem as CartItemType } from '../backend';
import { toast } from 'sonner';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { data: products } = useGetProducts();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();

  const product = products?.find((p) => p.id === item.productId);
  
  if (!product) return null;

  const priceInDollars = Number(product.price) / 100;
  const itemTotal = priceInDollars * Number(item.quantity);

  const handleUpdateQuantity = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    
    try {
      await updateItem.mutateAsync({
        productId: item.productId,
        size: item.size,
        quantity: BigInt(newQuantity),
      });
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const handleRemove = async () => {
    try {
      await removeItem.mutateAsync(item.productId);
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="w-24 h-32 flex-shrink-0 bg-muted rounded overflow-hidden">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h3 className="font-medium text-lg">{product.name}</h3>
              <p className="text-sm text-muted-foreground">Size: {item.size}</p>
              <p className="text-lg font-serif font-semibold mt-2">
                ${priceInDollars.toFixed(2)}
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleUpdateQuantity(Number(item.quantity) - 1)}
                  disabled={updateItem.isPending || Number(item.quantity) <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center font-medium">{item.quantity.toString()}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleUpdateQuantity(Number(item.quantity) + 1)}
                  disabled={updateItem.isPending}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center gap-4">
                <p className="font-semibold">${itemTotal.toFixed(2)}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRemove}
                  disabled={removeItem.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
