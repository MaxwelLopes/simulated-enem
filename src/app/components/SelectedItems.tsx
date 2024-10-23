type props = {
    subtypes: string[],
    handleRemoveSubType: Function
}

export const SelectedItems = ({ subtypes, handleRemoveSubType }: props) => {
    return (
      <div className="mt-2">
        <h3 className="text-sm font-medium text-gray-700">Selecionados:</h3>
        <ul className="list-disc pl-5">
          {subtypes.map((subtype) => (
            <li key={subtype} className="flex justify-between items-center">
              <span>{subtype}</span>
              <button
                className="ml-2 text-red-500 hover:text-red-700"
                onClick={() => handleRemoveSubType(subtype)}
              >
                Remover
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  