// import Image from 'next/image';

import MainPageWelcome from '@/components/main-page-welcome/main-page-welcome';

export default function Home() {
  return (
    <main className="flex h-screen flex-col items-center justify-center gap-6 bg-gradient-to-t from-slate-800 from-10% via-slate-700 via-30% to-slate-800 to-80%">
      <h1 className="text-md bg-gradient-to-r from-blue-200 to-violet-500 bg-clip-text text-center font-semibold text-transparent sm:text-2xl md:text-4xl">
        See why thousands choose our product.
      </h1>
      <MainPageWelcome />
    </main>
  );
}
