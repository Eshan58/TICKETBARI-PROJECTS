export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="text-center max-w-md mx-auto">
        <div className="relative mb-8">
          <div className="text-9xl font-bold text-gray-200">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-48 h-48 text-blue-500 opacity-20" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          Oops! The page you're looking for seems to have wandered off into the digital wilderness.
        </p>
        
        <div className="space-y-4">
          <a
            href="/"
            className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            Return Home
          </a>
          
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Need help? <a href="/contact" className="text-blue-500 hover:text-blue-600 font-medium">Contact Support</a>
            </p>
          </div>
        </div>
      </div>
      
      
      <div className="mt-12 flex space-x-2">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i}
            className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-blue-300 animate-pulse"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    </div>
  );
}