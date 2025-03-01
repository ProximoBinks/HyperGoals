export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white p-3 text-center text-sm">
      <div className="flex justify-center items-center">
        <img src="/logo-netlify.svg" alt="Netlify Logo" className="h-10" />
      </div>
      <p className="mt-2">© {new Date().getFullYear()} My App</p>
    </footer>
  );
}
