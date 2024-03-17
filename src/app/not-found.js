"use client"
import React from 'react';
import Image from 'next/image';
import Navbarcomponent from '@/components/navbar/Navbar'
import { useRouter } from 'next-nprogress-bar';

function NotFound() {
    const router = useRouter();
    return (
        <div className='h-[100vh]'>
            <Navbarcomponent home={true} />
            <div className='flex items-center flex-col justify-center h-full'>
                <div className='text-[25px] font-semibold'>
                    Ooopsie!
                </div>
                <div className='!max-w-[750px] !max-h-[300px] px-3 mt-5 mb-6'>
                    <Image src="/404notfound.svg" alt='' width={200} height={200} className='object-contain w-full h-full' />
                </div>
                <div className='text-[25px] font-semibold text-[#DBDCDD]'>
                    Page Not Found
                </div>
                <div className='flex flex-row gap-5 mt-3 items-center'>
                    <button className='flex flex-row items-center notf' onClick={() => { router.back(); }} >
                        {/* <div class="button">
                            <div class="button-box">
                                <span class="button-elem">
                                    <svg viewBox="0 0 46 40" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M46 20.038c0-.7-.3-1.5-.8-2.1l-16-17c-1.1-1-3.2-1.4-4.4-.3-1.2 1.1-1.2 3.3 0 4.4l11.3 11.9H3c-1.7 0-3 1.3-3 3s1.3 3 3 3h33.1l-11.3 11.9c-1 1-1.2 3.3 0 4.4 1.2 1.1 3.3.8 4.4-.3l16-17c.5-.5.8-1.1.8-1.9z"
                                        ></path>
                                    </svg>
                                </span>
                                <span class="button-elem">
                                    <svg viewBox="0 0 46 40">
                                        <path
                                            d="M46 20.038c0-.7-.3-1.5-.8-2.1l-16-17c-1.1-1-3.2-1.4-4.4-.3-1.2 1.1-1.2 3.3 0 4.4l11.3 11.9H3c-1.7 0-3 1.3-3 3s1.3 3 3 3h33.1l-11.3 11.9c-1 1-1.2 3.3 0 4.4 1.2 1.1 3.3.8 4.4-.3l16-17c.5-.5.8-1.1.8-1.9z"
                                        ></path>
                                    </svg>
                                </span>
                            </div>
                        </div> */}
                        <div className='bg-white text-black p-2 rounded-lg font-medium'>Go back</div>
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            router.push("/");
                        }}
                        className="bg-white text-black font-medium px-2 h-[40px] rounded-lg"
                    >
                        Return Home
                    </button>
                </div>
            </div>
        </div>
    )
}

export default NotFound
