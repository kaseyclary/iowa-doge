import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Navbar = ({ actionText = 'Explore', onActionClick }) => {
  const router = useRouter();

  const handleActionClick = () => {
    if (onActionClick) {
      onActionClick();
    } else if (actionText.toLowerCase() === 'home') {
      router.push('/');
    }
  };

  const handleLogoClick = () => {
    router.push('/');
  };

  return (
    <div className="bg-[#020617] border-b border-gray-800/50">
      <nav className="max-w-7xl mx-auto px-4 py-3">
        {/* Mobile Layout (default) */}
        <div className="md:hidden flex flex-col items-center space-y-3">
          <div className="flex items-center justify-between w-full">
            <div 
              className="relative w-20 cursor-pointer"
              onClick={handleLogoClick}
            >
              <Image
                src="/logo.webp"
                alt="Iowa Department of Government Analytics Logo"
                width={80}
                height={80}
                className="w-full h-full"
                priority={true}
              />
            </div>
            <button
              onClick={handleActionClick}
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              {actionText}
            </button>
          </div>
          <div className="text-center">
            <h1 className="text-base font-semibold leading-none text-white">
              DEPARTMENT OF GOVERNMENT ANALYTICS
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              The people are curious.
            </p>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:grid md:grid-cols-3 md:items-center">
          <div className="flex items-center gap-3">
            <div 
              className="relative w-40 cursor-pointer"
              onClick={handleLogoClick}
            >
              <Image
                src="/logo.webp"
                alt="Iowa Department of Government Analytics Logo"
                width={144}
                height={144}
                className="w-full h-full"
                priority={true}
              />
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <h1 className="text-lg font-semibold leading-none text-white">
              DEPARTMENT OF GOVERNMENT ANALYTICS
            </h1>
            <p className="text-sm text-gray-400">
              The people are curious.
            </p>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleActionClick}
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              {actionText}
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar; 