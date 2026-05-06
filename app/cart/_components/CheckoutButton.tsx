'use client';

import { useTransition } from 'react';
import { createCheckoutSession } from '@/app/actions/checkout';

type CheckoutButtonProps = {
  cartId: string;
  disabled?: boolean;
};

export function CheckoutButton({
  cartId,
  disabled = false,
}: CheckoutButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      try {
        await createCheckoutSession({ cartId });
      } catch (error) {
        console.error(error);
        if (error instanceof Error) {
          alert(error.message);
        } else {
          alert('Une erreur inconnue est survenue pendant le paiement.');
        }
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || isPending}
      className="w-full rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-400"
    >
      {isPending ? 'Redirection vers Stripe...' : 'Payer avec Stripe'}
    </button>
  );
}
