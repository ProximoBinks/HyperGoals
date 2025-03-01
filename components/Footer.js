export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-[#d089f4] to-[#764bb7] text-white p-3 text-center text-md">
      {/* <div className="flex justify-center items-center">
        <img src="/logo-netlify.svg" alt="Netlify Logo" className="h-10" />
      </div> */}
      <p className="mt-2 font-proxima-condensed font-bold text-lg">© {new Date().getFullYear()} Proximo</p>
    </footer>
  );
}