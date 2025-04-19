export const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-white mt-20">
      <div className="w-16 h-16 border-8 border-primary border-t-transparent border-solid rounded-full animate-spin"></div>
    </div>
  );
};