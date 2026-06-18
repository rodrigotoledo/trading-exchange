import { Outlet, Link } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="h-screen flex flex-col bg-surface">
      <header className="bg-surface border-b border-default shadow-sm shrink-0">
        <div className="flex items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold text-primary">Exchange Trading Dashboard</h1>
          <nav className="flex gap-6">
            <Link to="/" className="text-secondary hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/dashboard" className="text-secondary hover:text-primary transition-colors">
              Dashboard
            </Link>
            <Link to="/login" className="text-secondary hover:text-primary transition-colors">
              Login
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 bg-surface-secondary p-6 overflow-y-auto">
        <Outlet />
      </main>

      <footer className="bg-surface border-t border-default shrink-0">
        <div className="flex items-center justify-between px-6 py-4">
          <p className="text-sm text-secondary">© 2024 Exchange Trading Dashboard</p>
          <p className="text-xs text-secondary">v1.0.0</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
