import React from 'react';
import Navbarcomponent from '@/components/navbar/Navbar';
import { getAuthSession } from '@/app/api/auth/[...nextauth]/route';
import Notifications from '@/components/settingscomponent/Notifications';

async function Page() {
    const session = await getAuthSession();

    return (
        <div className='min-h-[100vh]'>
            <div className='h-20'>
                <Navbarcomponent home={true} />
            </div>
            <Notifications session={session}/>
        </div>
    );
}

export default Page;