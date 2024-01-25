"use client"
import React from 'react'
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import Link from 'next/link';
import { CatalogIcon, LoginIcon, SettingsIcon, LogoutIcon } from '@/lib/SvgIcons';
import { useSession, signIn, signOut } from 'next-auth/react';

function FloatingButton() {
    const iconClasses = "w-5 h-5 text-xl text-default-500 pointer-events-none flex-shrink-0";
    const { status } = useSession();

    return (
        <Dropdown backdrop="blur" placement="bottom-end">
            <DropdownTrigger>
                <button className="fixed bottom-5 left-4 w-[45px] h-[45px] text-white rounded-full flex items-center justify-center box-border outline-none bg-[#4d148c] shadow-2xl md:hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="ml-1 w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                    </svg>
                </button>
            </DropdownTrigger>
            <DropdownMenu variant="flat" aria-label="Profile Actions">
                <DropdownItem key="catalog" startContent={<CatalogIcon className={iconClasses} />}>
                    <Link href={`/anime/catalog`} className='w-full h-full block '>Catalog</Link>
                </DropdownItem>
                <DropdownItem key="settings" startContent={<SettingsIcon className={iconClasses} />}>
                    <Link href={`/anime/settings`} className='w-full h-full block '>Settings</Link>
                </DropdownItem>
                {status === 'authenticated' ? (
                    <DropdownItem key="logout" color="danger" startContent={<LogoutIcon className={iconClasses} />}>
                        <button className="font-semibold outline-none border-none w-full h-full block text-left" onClick={() => signOut('AniListProvider')}>Log Out</button>
                    </DropdownItem>
                ) : (
                    <DropdownItem key="login" color="danger" startContent={<LoginIcon className={iconClasses} />}>
                        <button className="font-semibold outline-none border-none w-full h-full block text-left" onClick={() => signIn('AniListProvider')}>LogIn With Anilist</button>
                    </DropdownItem>
                )}

            </DropdownMenu>
        </Dropdown>
    )
}

export default FloatingButton
