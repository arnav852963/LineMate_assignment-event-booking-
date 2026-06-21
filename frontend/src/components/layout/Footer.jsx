export default function Footer() {
  return (
    <footer className="w-full py-8 mt-20 border-t border-stone-200 bg-stone-50">
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-stone-500">
        <p>© 2026 Aura. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-stone-800 transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-stone-800 transition-colors">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}
