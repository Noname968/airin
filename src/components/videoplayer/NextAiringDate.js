import React from 'react'
import { NotificationIcon } from '@vidstack/react/icons';

function NextAiringDate({nextAiringEpisode}) {

    function calculatetime(){

        if (!nextAiringEpisode) {
            return "The next episode is not announced yet";
          }
        
          const airingDate = new Date(nextAiringEpisode.airingAt * 1000);
        
          const timeDifference = nextAiringEpisode.airingAt * 1000 - Date.now();
        
          const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
        
          const formattedDate = `${airingDate.getFullYear()}/${(airingDate.getMonth() + 1)
            .toString()
            .padStart(2, '0')}/${airingDate.getDate().toString().padStart(2, '0')} ${airingDate
            .getHours()
            .toString()
            .padStart(2, '0')}:${airingDate.getMinutes().toString().padStart(2, '0')} GMT`;
        
        const formattedTimeDifference = `(${Math.abs(days)} days, ${Math.abs(hours)} hours, ${Math.abs(minutes)} minutes, ${Math.abs(seconds)} seconds)`;
        
          return `The next episode is predicted to arrive on ${formattedDate} ${formattedTimeDifference}`;
        };

  return ( 
    <div className='hidden md:flex md:max-w-[1000px] my-5 text-[13px] bg-[#18181B] py-2 rounded-[8px] text-center text-[#ffffffb2]  flex-row gap-1 items-center justify-center'>
        <NotificationIcon size={18} />{calculatetime()}
    </div>
  )
}

export default NextAiringDate
