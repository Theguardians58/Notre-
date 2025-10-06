'use client';

import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  href?: string;
  className?: string;
}

const sizeMap = {
  sm: { image: 24, text: 'text-base' },
  md: { image: 32, text: 'text-lg' },
  lg: { image: 40, text: 'text-xl' },
  xl: { image: 48, text: 'text-2xl' },
};

export default function Logo({ 
  size = 'md', 
  showText = true, 
  href = '/dashboard',
  className = '' 
}: LogoProps) {
  const { image: imageSize, text: textClass } = sizeMap[size];

  const logoContent = (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative" style={{ width: imageSize, height: imageSize }}>
        <Image
          src="/logo-original.png"
          alt="CogniNote Logo"
          width={imageSize}
          height={imageSize}
          className="object-contain rounded-lg"
          priority
        />
      </div>
      {showText && (
        <span className={`font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ${textClass}`}>
          CogniNote
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="hover:opacity-80 transition-opacity">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}
