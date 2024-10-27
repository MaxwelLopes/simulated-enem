type AlternativeItemProps = {
  letter: string;
  text: string;
  response: string;
  setResponse: Function;
};

const AlternativeItem = ({
  letter,
  text,
  response,
  setResponse,
}: AlternativeItemProps) => {
  const isSelected = response == letter;
  const handleClick = () => {
    isSelected;
    console.log(letter, response, '----------------')
    setResponse(letter);
  };
  return (
    <li
      onClick={handleClick}
      className={`flex items-center p-4 mb-3 rounded-lg cursor-pointer 
    ${
      isSelected
        ? "bg-blue-500 text-white transition-colors duration-300 ease-in-out"
        : "bg-gray-100 hover:bg-blue-100"
    }`}
    >
      <span
        className={`flex items-center justify-center w-8 h-8 rounded-full font-bold 
          ${isSelected ? "bg-white text-blue-500" : "bg-blue-500 text-white"}`}
      >
        {letter}
      </span>
      <span className="flex-1 ml-4 text-lg">{text}</span>
    </li>
  );
};

export default AlternativeItem;
