import { useRouter } from "next/navigation";
import { LogoutButton } from "../auth";

const NavBar = () => {
  const router = useRouter();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-4">
          <button
            onClick={() => router.push("/")}
            className="text-gray-800 text-lg font-semibold hover:text-blue-500 transition-all duration-300"
          >
            Home
          </button>
          <button
            onClick={() => router.push("/simulated")}
            className="text-gray-800 text-lg font-semibold hover:text-blue-500 transition-all duration-300"
          >
            Meus Simulados
          </button>
          <button
            onClick={() => router.push("/createSimulated")}
            className="text-gray-800 text-lg font-semibold hover:text-blue-500 transition-all duration-300"
          >
            Novo Simulado
          </button>
          <button
            onClick={() => router.push("/desempenho")}
            className="text-gray-800 text-lg font-semibold hover:text-blue-500 transition-all duration-300"
          >
            Desempenho
          </button>
        </div>
        <LogoutButton />
      </div>
    </nav>
  );
};

export default NavBar;
