export const GenericError = () => {
    return (
      <div className="flex items-center p-4 mb-4 text-red-700 bg-red-100 rounded-lg" role="alert">
        <svg
          className="w-6 h-6 mr-2"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a1 1 0 110-2 1 1 0 010 2zm1-9H9v6h2V7z" />
        </svg>
        <span>Ocorreu um erro inesperado. Tente novamente mais tarde.</span>
      </div>
    );
  };