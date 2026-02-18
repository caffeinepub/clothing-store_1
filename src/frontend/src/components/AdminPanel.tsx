import { useEffect, useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../hooks/useQueries';
import PaymentSetup from './PaymentSetup';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

export default function AdminPanel() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading } = useIsCallerAdmin();
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  useEffect(() => {
    if (identity && isAdmin && !isLoading) {
      setShowAdminPanel(true);
    }
  }, [identity, isAdmin, isLoading]);

  if (!isAdmin || isLoading) return null;

  return (
    <Dialog open={showAdminPanel} onOpenChange={setShowAdminPanel}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Admin Panel</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <PaymentSetup />
        </div>
      </DialogContent>
    </Dialog>
  );
}
