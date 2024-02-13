"use client"
import React, { useEffect, useState } from 'react';

function NextAiringDate({ nextAiringEpisode }) {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!nextAiringEpisode) {
      return;
    }

    const intervalId = setInterval(() => {
      const timeDifference = nextAiringEpisode.airingAt * 1000 - Date.now();

      if (timeDifference <= 0) {
        clearInterval(intervalId);
        setTimeLeft(null);
      } else {
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [nextAiringEpisode]);

  if (!nextAiringEpisode || timeLeft === null) {
    return (
    <div className='hidden w-[98%] mx-auto lg:w-full md:flex xl:max-w-[96.5%] my-5 text-[13px] bg-[#18181B] py-2 rounded-[8px] text-center text-[#ffffffb2]  flex-row gap-1 items-center justify-center'>
       The next episode will be Airing Shortly... 
    </div>
    )}

  const formattedTimeLeft = `(${timeLeft.days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes, ${timeLeft.seconds} seconds)`;

  return (
    <div className='hidden w-[98%] mx-auto lg:w-full md:flex xl:max-w-[96.5%] my-5 text-[13px] bg-[#18181B] py-2 rounded-[8px] text-center text-[#ffffffb2]  flex-row gap-1 items-center justify-center'>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 0 1-1.44-4.282m3.102.069a18.03 18.03 0 0 1-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 0 1 8.835 2.535M10.34 6.66a23.847 23.847 0 0 0 8.835-2.535m0 0A23.74 23.74 0 0 0 18.795 3m.38 1.125a23.91 23.91 0 0 1 1.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 0 0 1.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 0 1 0 3.46" />
      </svg>
      {`The next episode will air in ${formattedTimeLeft}`}
    </div>
  );
}

export default NextAiringDate;
