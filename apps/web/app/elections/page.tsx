import { ElectionSearch } from '@/components/election-search';

export default function ElectionsPage() {
  return (
    <div className="min-h-screen p-8 pb-20">
      <header className="max-w-4xl mx-auto mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Find Your Elections</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Enter your address to see upcoming elections, candidates on your ballot, and your polling
          location.
        </p>
      </header>

      <main>
        <ElectionSearch />
      </main>
    </div>
  );
}
