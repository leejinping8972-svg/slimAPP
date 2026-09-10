import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#F7F5F1] px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#6B7A62]">404</p>
      <h1 className="mt-3 font-['Montserrat'] text-3xl font-bold text-[#1E261C]">Page not found</h1>
      <Link
        href="/"
        className="mt-8 bg-[#1E261C] px-6 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white"
      >
        Back to Home
      </Link>
    </main>
  );
}
