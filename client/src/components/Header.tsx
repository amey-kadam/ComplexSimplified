export default function Header() {
  return (
    <header className="w-full bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-primary text-2xl">
            <i className="fas fa-lightbulb"></i>
          </span>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">SimplifyIt</h1>
        </div>
        <span className="text-sm text-gray-500">Complex topics made simple</span>
      </div>
    </header>
  );
}
