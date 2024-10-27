import { Question } from "@prisma/client";

type props = {
  question: Question;
};

export const QuestionView = ({ question } : props) => {
  const {
    year,
    context,
    alternativesIntroduction,
    alternativeA,
    alternativeB,
    alternativeC,
    alternativeD,
    alternativeE,
  } = question;

  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-2xl mx-auto my-4 border border-gray-300">
      <h2 className="text-xl font-semibold text-gray-700 mb-2">Ano: {year}</h2>

      {context && <p className="text-gray-800 mb-4">{context}</p>}

      {alternativesIntroduction && (
        <p className="text-gray-600 mb-2">{alternativesIntroduction}</p>
      )}

      <ul className="space-y-2">
        <li className="flex items-start">
          <span className="font-semibold text-gray-600 mr-2">A:</span>
          <span>{alternativeA}</span>
        </li>
        <li className="flex items-start">
          <span className="font-semibold text-gray-600 mr-2">B:</span>
          <span>{alternativeB}</span>
        </li>
        <li className="flex items-start">
          <span className="font-semibold text-gray-600 mr-2">C:</span>
          <span>{alternativeC}</span>
        </li>
        <li className="flex items-start">
          <span className="font-semibold text-gray-600 mr-2">D:</span>
          <span>{alternativeD}</span>
        </li>
        <li className="flex items-start">
          <span className="font-semibold text-gray-600 mr-2">E:</span>
          <span>{alternativeE}</span>
        </li>
      </ul>
    </div>
  );
};
