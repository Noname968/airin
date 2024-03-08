import Navbarcomponent from '@/components/navbar/Navbar';
import React from 'react';
import Image from 'next/image';

const UnderDevelopment = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <Navbarcomponent/>
      <div className="text-center flex flex-col gap-4 items-center px-2">
        <Image src='/construction.svg' width={400} height={400} alt='work in progress'/>
        <h1 className="text-2xl sm:text-3xl font-bold">Page Under Development</h1>
        <p className="text-lg text-gray-400">This page is currently under development. Please check back later.</p>
      </div>
    </div>
  );
};

export default UnderDevelopment;
