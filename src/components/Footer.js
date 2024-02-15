import React from 'react'
import Link from 'next/link'

function Footer() {
    const year = new Date().getFullYear();
    const month = new Date().getMonth()

    function getSeason(month) {
        if (month === 12 || month === 1 || month === 2) {
            return 'WINTER';
        } else if (month === 3 || month === 4 || month === 5) {
            return 'SPRING';
        } else if (month === 6 || month === 7 || month === 8) {
            return 'SUMMER';
        } else {
            return 'FALL';
        }
    }

    const format = ['WINTER', 'SPRING', 'SUMMER', 'FALL'];

    console.log(month)

    function nextSeason(currentSeason) {
        const currentSeasonIndex = format.indexOf(currentSeason);

        const nextSeasonIndex = (currentSeasonIndex + 1) % format.length;

        return format[nextSeasonIndex];
    }

    return (
        <div>
            <footer className="bg-[#151518] mt-10">
                <div className="mx-auto w-full lg:max-w-[85%] p-4 py-6 lg:pt-8 lg:pb-3">
                    <div className="lg:flex lg:justify-between">
                        <div className="mb-6 lg:mb-0">
                            <Link href="/" className="flex items-center w-fit">
                                <p className={`aniplay self-center text-3xl font-medium whitespace-nowrap dark:text-white`}>ANIPLAY</p>
                            </Link>
                            <p className="font-karla lg:text-[0.8rem] text-[0.7rem] text-[#ffffffb2] lg:w-[520px]">
                                This site does not store any files on our server, we are linked
                                to the media which is hosted on 3rd party services.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 lg:gap-16 sm:gap-6 sm:grid-cols-2">
                            <div>
                                <ul className=" font-normal flex flex-col gap-2 lg:text-[0.85rem] text-[0.7rem] text-[#ffffffb2] ">
                                    <li className="">
                                        <Link href={`/anime/catalog?season=${getSeason(month + 1)}&year=2024`} className="hover:text-white">This Season</Link>
                                    </li>
                                    <li className="">
                                        <Link href={`/anime/catalog?season=${nextSeason(getSeason(month + 1))}&year=2024`} className="hover:text-white">Upcoming Season</Link>
                                    </li>
                                    <li>
                                        <Link href="/anime/catalog?format=MOVIE" className="hover:text-white"> Movies</Link>
                                    </li>
                                    <li>
                                        <Link href="/anime/catalog?format=TV" className="hover:text-white"> Tv Shows</Link>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <ul className="font-medium flex flex-col gap-2 lg:text-[0.85rem] text-[0.7rem] text-[#ffffffb2]">
                                    <li className="">
                                        <Link href="/" className="hover:text-white">Privacy Policy</Link>
                                    </li>
                                    <li>
                                        <Link href="/" className="hover:text-white"> DMCA</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='bg-tersier border-t border-white/5 mt-2'></div>
                <div className="mx-auto w-full lg:max-w-[83%] lg:flex lg:items-center lg:justify-between lg:text-[0.8rem] text-[0.7rem] text-[#ffffffb2] py-3">
                    <span className="sm:text-center ms-5 lg:ms-0">© {year} <Link href="/" className="hover:text-white">ANIPLAY™</Link> | Made by Luckyhv
                    </span>
                    <div className="flex mt-4 lg:justify-center lg:mt-0">
                        <Link href="https://github.com/Luckyhv/aniplay" target="_blank" className=" hover:text-gray-900 dark:hover:text-white ms-5 lg:ms-0">
                            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z" clipRule="evenodd" />
                            </svg>
                            <span className="sr-only">GitHub account</span>
                        </Link>
                        <Link href="https://discord.gg/HaVe2SMvJB" target="_blank" className=" hover:text-gray-900 dark:hover:text-white ms-5">
                            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 21 16">
                                <path d="M16.942 1.556a16.3 16.3 0 0 0-4.126-1.3 12.04 12.04 0 0 0-.529 1.1 15.175 15.175 0 0 0-4.573 0 11.585 11.585 0 0 0-.535-1.1 16.274 16.274 0 0 0-4.129 1.3A17.392 17.392 0 0 0 .182 13.218a15.785 15.785 0 0 0 4.963 2.521c.41-.564.773-1.16 1.084-1.785a10.63 10.63 0 0 1-1.706-.83c.143-.106.283-.217.418-.33a11.664 11.664 0 0 0 10.118 0c.137.113.277.224.418.33-.544.328-1.116.606-1.71.832a12.52 12.52 0 0 0 1.084 1.785 16.46 16.46 0 0 0 5.064-2.595 17.286 17.286 0 0 0-2.973-11.59ZM6.678 10.813a1.941 1.941 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.919 1.919 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Zm6.644 0a1.94 1.94 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.918 1.918 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Z" />
                            </svg>
                            <span className="sr-only">Discord community</span>
                        </Link>
                        <Link href="/" className="pointer-events-none hover:text-gray-900 dark:hover:text-white ms-5">
                            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 17">
                                <path fillRule="evenodd" d="M20 1.892a8.178 8.178 0 0 1-2.355.635 4.074 4.074 0 0 0 1.8-2.235 8.344 8.344 0 0 1-2.605.98A4.13 4.13 0 0 0 13.85 0a4.068 4.068 0 0 0-4.1 4.038 4 4 0 0 0 .105.919A11.705 11.705 0 0 1 1.4.734a4.006 4.006 0 0 0 1.268 5.392 4.165 4.165 0 0 1-1.859-.5v.05A4.057 4.057 0 0 0 4.1 9.635a4.19 4.19 0 0 1-1.856.07 4.108 4.108 0 0 0 3.831 2.807A8.36 8.36 0 0 1 0 14.184 11.732 11.732 0 0 0 6.291 16 11.502 11.502 0 0 0 17.964 4.5c0-.177 0-.35-.012-.523A8.143 8.143 0 0 0 20 1.892Z" clipRule="evenodd" />
                            </svg>
                            <span className="sr-only">Twitter page</span>
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Footer
