import React from 'react';

type TextSegment = {
  type: 'text' | 'italic' | 'bold' | 'img';
  content: string;
};

function parseLine(line: string): TextSegment[] {
  const segments: TextSegment[] = [];
  
  const regex = /!\[\]\(([^)]+)\)|\*\*([^\*]+)\*\*|\*([^\*]+)\*|_([^_]+)_|([^\*_!\n]+)/g;

  let match;
  while ((match = regex.exec(line)) !== null) {
    if (match[1]) {
      
      segments.push({ type: 'img', content: match[1] });
    } else if (match[2]) {
    
      segments.push({ type: 'bold', content: match[2] });
    } else if (match[3]) {
   
      segments.push({ type: 'italic', content: match[3] });
    } else if (match[4]) {
      
      segments.push({ type: 'italic', content: match[4] });
    } else if (match[5]?.trim() !== '') {
     
      segments.push({ type: 'text', content: match[5] });
    }
  }

  return segments;
}

function formatText(text: string) {
  const lines = text.split('\n'); 
  return lines.flatMap((line, lineIndex) => {
    const segments = parseLine(line);
    const formattedLine = segments.map((segment, index) => {
      switch (segment.type) {
        case 'bold':
          return <strong key={`${lineIndex}-${index}`}>{segment.content}</strong>;
        case 'italic':
          return <em key={`${lineIndex}-${index}`}>{segment.content}</em>;
        case 'img':
          return <img key={`${lineIndex}-${index}`} src={`/imgs/${segment.content}`} alt="Imagem" />;
        default:
          return <span key={`${lineIndex}-${index}`}>{segment.content}</span>;
      }
    });

    return [...formattedLine, <br key={`br-${lineIndex}`} />];
  });
}

const TextFormatter: React.FC<{ text: string }> = ({ text }) => {
  return <div>{formatText(text)}</div>;
};

export default TextFormatter;
