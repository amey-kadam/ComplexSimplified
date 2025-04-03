export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-200 py-6 mt-10">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-gray-500">
          &copy; {currentYear} SimplifyIt | Complex topics made simple for everyone
        </p>
      </div>
    </footer>
  );
}
