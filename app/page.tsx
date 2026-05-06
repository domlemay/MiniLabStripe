import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black">
      <Link
        href="/cart"
        className="rounded-lg bg-indigo-600 px-8 py-4 text-lg font-semibold text-white hover:bg-indigo-700 transition"
      >
        Aller au panier
      </Link>
    </main>
  );
}
