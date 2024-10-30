const SimulatedButton = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-all duration-300"
  >
    Ver Simulado
  </button>
);

export default SimulatedButton;
