'use client';

import { useTRPC } from '@/trpc/client';
import { useQuery } from '@tanstack/react-query';
import { useAlert } from '@ui/components/alert-dialog-provider';
import { Button } from '@ui/components/ui/button';
import { useModal } from '@ui/hooks/useModal';

export function HomePageImpl() {
  const alert = useAlert();
  const modal = useModal();
  const trpc = useTRPC();
  const { data } = useQuery(
    trpc.hello.hello.queryOptions({
      name: 'World',
    }),
  );

  function handleAlert() {
    alert({
      title: 'Alert',
      body: 'This is an alert',
      cancelButton: 'Cancel',
    });
  }

  function handleOpenModal() {
    modal.openModal({
      title: 'Modal',
      content: <div>This is a modal</div>,
    });
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-6xl">
            Welcome to My App
          </h1>

          <p className="text-xl text-gray-600">{data || 'Loading...'}</p>
          <div className="flex gap-4 justify-center">
            <Button variant="default" size="lg" onClick={handleAlert}>
              Alert
            </Button>
            <Button variant="outline" size="lg" onClick={handleOpenModal}>
              open modal
            </Button>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Feature 1</h3>
              <p className="text-gray-600">
                Description of your amazing feature goes here.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Feature 2</h3>
              <p className="text-gray-600">
                Another cool feature description goes here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
