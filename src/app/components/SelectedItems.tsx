type props = {
  subtypes: string[];
  handleRemoveSubType: Function;
};

export const SelectedItems = ({ subtypes, handleRemoveSubType }: props) => {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {subtypes.map((subtype) => (
        <span
          key={subtype}
          className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full"
        >
          {subtype}
          <button
            onClick={() => handleRemoveSubType(subtype)}
            className="ml-2 text-blue-600 hover:text-blue-800"
          >
            &times;
          </button>
        </span>
      ))}
    </div>
  );
};
