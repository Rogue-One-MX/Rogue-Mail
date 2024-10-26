import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded-md w-96 p-8 text-center">
        {/* Logo Image */}
        <Image 
          src="/rogue.png" // Just the relative path from the public folder
          alt="Rogue One Logo" 
          width={150} 
          height={50} 
          className="mx-auto mb-4"
        />

        <h1 className="text-xl font-bold mb-4">Rogue One experience</h1>
        
        <div className="flex flex-col space-y-4">
          <Link href="/signin">
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Sign in
            </button>
          </Link>
          
          <Link href="/signup">
            <button className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
              Register
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
