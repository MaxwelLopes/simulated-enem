import React from 'react';
export default function NotFoundPage({}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 text-center">
      <h1 className="text-4xl font-bold mb-4">Página não encontrada</h1>
      <p className="text-gray-500 text-lg">A página que você está tentando acessar não existe ou você não tem permissão.</p>
    </main>
  );
}