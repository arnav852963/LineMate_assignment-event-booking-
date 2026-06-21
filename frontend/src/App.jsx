import { Outlet } from 'react-router-dom';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';

export default function App() {
  return (
    <div className="min-h-screen bg-texture selection:bg-orange-800 selection:text-white font-sans text-stone-900 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
