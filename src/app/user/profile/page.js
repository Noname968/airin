import Navbarcomponent from '@/components/navbar/Navbar'
import React from 'react'
import UserInfo from '../../../components/profile/UserInfo'
import { UserProfile } from '@/lib/AnilistUser'
import { getAuthSession } from '../../api/auth/[...nextauth]/route'
import Image from 'next/image'
import { formatTimeStamp } from '@/utils/TimeFunctions';
import Link from 'next/link';
import { redirect } from 'next/navigation';

async function page() {
  const session = await getAuthSession();

  if (!session || !session.user) {
    redirect('/');
  }

  const data = await UserProfile(session?.user?.token, session?.user?.name);
  const { user, lists } = data;

  return (
    <div className='min-h-screen'>
      <Navbarcomponent home={true} />
      <div className='relative'>
        {user.bannerImage ? (
          <div className="relative w-full brightness-50">
            <Image
              src={user.bannerImage}
              alt="image"
              width={1000}
              height={1000}
              priority={true}
              className="w-full h-[280px] object-cover"
            />
            <div className='absolute h-[120px] bottom-0 left-0 right-0 bg-gradient-to-t from-black' />
          </div>
        ) : (
          <div className="relative w-full brightness-50">
            <Image
              src={'/settingsbanner.jpg'}
              alt="image"
              width={1000}
              height={1000}
              priority={true}
              className="w-full h-[280px] object-cover"
            />
            <div className='absolute h-[120px] bottom-0 left-0 right-0 bg-gradient-to-t from-black' />
          </div>
        )}
        <div className="flex items-center gap-5 absolute top-32 max-w-[95%] lg:max-w-[90%] xl:max-w-[86%] left-0 right-0 mx-auto">
          <div className='flex items-center gap-4'>
            <Image
              src={user?.avatar?.large}
              alt="user avatar"
              width={100}
              height={100}
              priority={true}
              className="object-cover h-28 w-28 rounded-lg z-10"
            />
            <div className=' pt-2'>
              <div className='flex flex-row gap-4'>
                <h1 className="font-bold text-2xl">{user?.name}</h1>
                <Link
                  href={"https://anilist.co/settings/"}
                  className="flex items-center"
                  target='_blank'
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                  </svg>
                </Link>
              </div>
              <p className="text-sm">Joined on : {formatTimeStamp(user?.createdAt)}</p>
            </div>
          </div>
        </div>
      </div>
      <UserInfo lists={lists} session={session} />
    </div>
  )
}

export default page
