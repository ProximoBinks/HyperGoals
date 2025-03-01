import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-[#111827]">
      {/* Fixed Header */}
      <Header title="HYPERGOALS" />

      {/* Main Content - Ensures Proper Spacing from Header */}
      <main className="flex-grow pt-14 px-4 pb-10">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}