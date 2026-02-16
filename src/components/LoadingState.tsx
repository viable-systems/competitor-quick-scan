export function LoadingState() {
  return (
    <div className="w-full max-w-4xl mx-auto text-center py-12">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="mt-4 text-gray-600">Analyzing competitor... This may take a moment.</p>
    </div>
  );
}
