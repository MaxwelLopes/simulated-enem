export const subjects = [
  "Matemática",
  "Língua Portuguesa",
  "Literatura",
  "Artes",
  "Educação Física",
  "Tecnologia da Informação e Comunicação",
  "História",
  "Geografia",
  "Filosofia",
  "Sociologia",
  "Biologia",
  "Física",
  "Química",
  "Inglês",
  "Espanhol",
];

export const subjectsByDiscipline: Record<string, string[]> = {
  "Matemática e suas Tecnologias": ["Matemática"],
  "Linguagens, Códigos e suas Tecnologias": [
    "Língua Portuguesa",
    "Literatura",
    "Artes",
    "Educação Física",
    "Tecnologia da Informação e Comunicação",
  ],
  "Ciências Humanas e suas Tecnologias": [
    "História",
    "Geografia",
    "Filosofia",
    "Sociologia",
  ],
  "Ciências da Natureza e suas Tecnologias": ["Biologia", "Física", "Química"],
};
