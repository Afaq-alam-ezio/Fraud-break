import AppHeader from '../components/AppHeader.jsx';

// Temporary page for the screens we have not built yet.
export default function Placeholder({ title, note }) {
  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-display text-3xl font-semibold">{title}</h1>
        <p className="mt-3 text-ink-soft">{note}</p>
      </main>
    </div>
  );
}
