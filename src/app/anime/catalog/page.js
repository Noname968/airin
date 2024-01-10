import React from 'react'
import Catalog from '@/components/catalogcomponent/Catalog'
import Navbarcomponent from '@/components/Navbar'

function page() {
  return (
    <div>
      <Navbarcomponent/>
        <div className='max-w-[94%] xl:max-w-[88%] mx-auto mt-[60px]'>
        <Catalog/>
        </div>
    </div>
  )
}

export default page
