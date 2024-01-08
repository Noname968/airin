import React from 'react'
import Image from 'next/image'

function Singlecard({item}) {
  return (
    <div className={`w-[190px] h-[250px]`}>
    <Image src={item.coverImage.extraLarge} width={250} height={400} className={`w-[190px] h-[250px]`}/>
    </div>
  )
}

export default Singlecard
