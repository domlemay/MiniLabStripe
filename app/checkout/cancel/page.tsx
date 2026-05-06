import Link from 'next/link';

export default function CancelPage() {
  return (
    <main className="mx-auto max-w-2xl p-8 text-center">
      <h1 className="mb-4 text-3xl font-bold text-orange-600">
        Paiement annulé
      </h1>

      <p className="mb-6 text-gray-600">
        Votre paiement a été annulé. Votre panier est toujours disponible.
      </p>

      <Link
        href="/cart"
        className="inline-block rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700"
      >
        Retour au panier
      </Link>
    </main>
  );
}
