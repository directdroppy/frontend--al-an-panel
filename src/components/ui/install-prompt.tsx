import { useEffect, useState } from 'react';
import { Button } from './button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './dialog';
import { Download } from 'lucide-react';

export function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isInstalledPWA = window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(isInstalledPWA);

    // Don't show prompt if already installed
    if (isInstalledPWA) {
      return;
    }

    const handler = (e: any) => {
      // Only handle install prompt in production
      if (import.meta.env.PROD) {
        e.preventDefault();
        setDeferredPrompt(e);
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Show prompt for iOS users too, but only in production
    if (isIOSDevice && !isInstalledPWA && import.meta.env.PROD) {
      setShowPrompt(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowPrompt(false);
      }
    }
  };

  // Don't show prompt if already installed or in development
  if (!showPrompt || isStandalone || import.meta.env.DEV) return null;

  return (
    <Dialog open={showPrompt} onOpenChange={setShowPrompt}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Uygulamayı Yükle</DialogTitle>
          <DialogDescription>
            {isIOS ? (
              <>
                iOS cihazınıza yüklemek için:
                <ol className="mt-2 space-y-2 text-sm">
                  <li>1. Safari tarayıcısının paylaş butonuna 📤 tıklayın</li>
                  <li>2. "Ana Ekrana Ekle" seçeneğini seçin</li>
                  <li>3. "Ekle" butonuna tıklayın</li>
                </ol>
              </>
            ) : (
              'Daha iyi bir deneyim için Tefaiz uygulamasını cihazınıza yükleyin.'
            )}
          </DialogDescription>
        </DialogHeader>
        {!isIOS && (
          <div className="flex justify-end gap-4 mt-4">
            <Button variant="outline" onClick={() => setShowPrompt(false)}>
              Daha Sonra
            </Button>
            <Button onClick={handleInstall} className="gap-2">
              <Download className="w-4 h-4" />
              Yükle
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}