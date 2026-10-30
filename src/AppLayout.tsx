import { Outlet, ScrollRestoration } from 'react-router';
import { Header } from './components/Header';

export function AppLayout() {
  return (
    <>
      {/* A plain #main link would be read as a route by the hash router, so move focus directly. */}
      <a
        href="#main"
        className="skip-link"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById('main')?.focus();
        }}
      >
        Skip to content
      </a>
      <Header />
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <ScrollRestoration />
    </>
  );
}
