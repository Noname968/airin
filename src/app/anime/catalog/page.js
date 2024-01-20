import React from 'react'
import Catalog from '@/components/catalogcomponent/Catalog'
import Navbarcomponent from '@/components/Navbar'

export async function generateMetadata({ params }) {
  
  return {
    title: "Aniplay - Catalog",
    openGraph: {
      title: "Aniplay - Catalog",
    },
    twitter: {
      card: "summary",
      title: "Aniplay - Catalog",
    },
  }
}

function page() {
  return (
    <div>
      <Navbarcomponent/>
        <div className='max-w-[94%] xl:max-w-[88%] mx-auto mt-[70px]'>
        <Catalog/>
        </div>
    </div>
  )
}

export default page
