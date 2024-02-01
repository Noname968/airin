import Navbarcomponent from '@/components/navbar/Navbar'
import SettingsPage from '@/components/settingscomponent/SettingsPage'
import React from 'react'

function page() {
    return (
        <div>
            <Navbarcomponent home={false} />
            <SettingsPage/>
        </div>
    )
}

export default page
