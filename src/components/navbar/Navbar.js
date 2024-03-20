"use client"
import React, { useEffect, useState } from 'react';
import { DropdownItem, DropdownTrigger, Dropdown, DropdownMenu, DropdownSection, Avatar, Badge, useDisclosure } from "@nextui-org/react";
import Link from "next/link"
import styles from '../../styles/Navbar.module.css'
import { useSession, signIn, signOut } from 'next-auth/react';
import { FeedbackIcon, LoginIcon, LogoutIcon, SettingsIcon, ProfileIcon, NotificationIcon } from '@/lib/SvgIcons';
import { Usernotifications } from '@/lib/AnilistUser';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import Feedbackform from './Feedbackform';
import { NotificationTime } from '@/utils/TimeFunctions';
import { useTitle, useSearchbar } from '@/lib/store';
import { useStore } from 'zustand';
import Image from 'next/image';

function Navbarcomponent({ home = false }) {
    const animetitle = useStore(useTitle, (state) => state.animetitle);
    const Isopen = useStore(useSearchbar, (state) => state.Isopen);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const iconClasses = "w-5 h-5 text-xl text-default-500 pointer-events-none flex-shrink-0";
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { data, status } = useSession();
    const [hidden, setHidden] = useState(false);
    const { scrollY } = useScroll();
    const [notifications, setNotifications] = useState([]);
    const [todayNotifications, setTodayNotifications] = useState([]);
    const [selectedTimeframe, setSelectedTimeframe] = useState('Today');

    const handleTimeframeChange = (e) => {
        setSelectedTimeframe(e.target.value);
    };

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious();
        if (latest > previous && latest > 150) {
            setHidden(true);
        }
        else {
            setHidden(false);
            setIsScrolled(false);
        }
        if (latest > 50) {
            setIsScrolled(true)
        }
    })

    useEffect(() => {
        if (status === 'authenticated') {
            setIsLoggedIn(true);
        }
        else {
            setIsLoggedIn(false);
        }
    }, [status])

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                if (status === 'authenticated' && data?.user?.token) {
                    const response = await Usernotifications(data.user.token, 1);
                    const notify = response?.notifications?.filter(item => Object.keys(item).length > 0);
                    setNotifications(notify);
                    const filteredNotifications = filterNotifications(notify);
                    setTodayNotifications(filteredNotifications);
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        }
        fetchNotifications();
    }, [status, data]);

    function filterNotifications(notifications) {
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const oneDayInSeconds = 24 * 60 * 60;
        return notifications.filter(notification => {
            const createdAtTimestamp = notification.createdAt;
            const timeDifference = currentTimestamp - createdAtTimestamp;
            return timeDifference <= oneDayInSeconds;
        });
    }

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === 'KeyS' && e.ctrlKey) {
                e.preventDefault();
                useSearchbar.setState({ Isopen: !useSearchbar.getState().Isopen });
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [Isopen]);

    const navbarClass = isScrolled
        ? `${home ? styles.homenavbar : styles.navbar} ${home && styles.navbarscroll}`
        : home ? styles.homenavbar : styles.navbar;

    return (
        <motion.nav className={navbarClass}
            variants={{
                visible: { y: 0 },
                hidden: { y: "-100%" },
            }}
            animate={hidden ? 'hidden' : 'visible'}
            transition={{ duration: 0.3, ease: "easeInOut" }}
        >
            <div className={styles.navleft}>
                <div className={styles.logoContainer}>
                    <Link href="/" className={styles.logoLink}>
                        {/* ANIPLAY */}
                        <Image src='/logo.svg' width={50} height={50} className="w-32 h-20 "/>
                    </Link>
                </div>
                <div className={styles.navItemsContainer}>
                    <Link href="/anime/catalog" className={styles.navItem}>Catalog</Link>
                    <Link href="/anime/catalog?sortby=TRENDING_DESC" className={styles.navItem}>Trending</Link>
                    <Link href="/anime/catalog?format=MOVIE" className={styles.navItem}>Movies</Link>
                    <Link href="https://community.aniplaynow.live" className={styles.navItem}>Community</Link>
                </div>
            </div>
            <div className={styles.navright}>
                <button
                    type="button"
                    title="Search"
                    onClick={() => useSearchbar.setState({ Isopen: true }) } 
                    className="w-[26px] h-[26px] outline-none"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                    >
                        <path
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 15l6 6m-11-4a7 7 0 110-14 7 7 0 010 14z"
                        ></path>
                    </svg>
                </button>
                <div>
                    {isLoggedIn && (
                        <Dropdown placement="bottom-end" classNames={{
                            base: "before:bg-default-200",
                            content: "py-1 px-1 border border-default-200 bg-gradient-to-br from-white to-default-200 dark:from-default-50 dark:to-black",
                        }}>
                            <DropdownTrigger>
                                <div className='w-[26px] h-[26px] mr-2 mt-[2px] cursor-pointer'>
                                    <Badge color="danger" content={todayNotifications?.length} shape="circle" showOutline={false} size="sm">
                                        <NotificationIcon className="fill-current " />
                                    </Badge>
                                </div>
                            </DropdownTrigger>
                            <DropdownMenu variant="flat" className='w-[320px] '
                                aria-label="Avatar Actions"
                                emptyContent="No New Notifications"
                            >
                                <DropdownSection title="Notifications">
                                    <DropdownItem
                                        isReadOnly
                                        classNames={{
                                            base: 'py-0 !hover:bg-none'
                                        }}
                                        key="theme"
                                        className="cursor-default"
                                        endContent={
                                            <select
                                                className="z-10 outline-none cursor-pointer w-[72px] py-0.5 rounded-md text-tiny group-data-[hover=true]:border-default-500 border-small border-default-300 dark:border-default-200 bg-transparent text-default-500"
                                                id="theme"
                                                name="theme"
                                                value={selectedTimeframe}
                                                onChange={handleTimeframeChange}
                                            >
                                                <option>Today</option>
                                                <option>Recent</option>
                                            </select>
                                            // <div className='flex flex-row gap-3'>
                                            //     <button className='bg-[#18181b] px-3 py-1'>Today</button>
                                            //     <button>Recent</button>
                                            // </div>
                                        }
                                    >
                                        Select Timeframe
                                    </DropdownItem>
                                </DropdownSection>
                                <DropdownSection className='w-full'>
                                    {selectedTimeframe === 'Today' ? (
                                        todayNotifications?.length > 0 ? todayNotifications?.slice(0, 3).map((item) => {
                                            const { contexts, media, episode, createdAt } = item;
                                            return (
                                                <DropdownItem
                                                    key={item.id}
                                                    showFullDescription
                                                    description={`${contexts?.[0]} ${episode} ${contexts?.[1]} ${media?.title?.[animetitle] || media?.title?.romaji} ${contexts?.[contexts?.length - 1]}`}
                                                    className='py-2 w-full'
                                                    classNames={{
                                                        description: 'text-[11px] text-[#A1A1AA]',
                                                    }}
                                                >
                                                    <div className='flex flex-row items-center justify-between w-[290px]'>
                                                        <p className='font-semibold text-[14px] w-full'>
                                                            {((media?.title?.[animetitle] || media?.title?.romaji) || '').slice(0, 24)}
                                                            {((media?.title?.[animetitle] || media?.title?.romaji) || '').length > 24 && '...'}
                                                        </p>
                                                        <span className='text-[#f1f1f1b2] text-[10px]'>{NotificationTime(createdAt)}</span>
                                                    </div>
                                                </DropdownItem>
                                            );
                                        }) : (
                                            <DropdownItem
                                                key={"Lol"}
                                                showFullDescription
                                                className='py-3 w-full text-center'
                                            >
                                                No New Notifications
                                            </DropdownItem>
                                        )
                                    ) : (
                                        notifications?.length > 0 ? notifications?.slice(0, 3).map((item) => {
                                            const { contexts, media, episode, createdAt } = item;
                                            return (
                                                <DropdownItem
                                                    key={item.id}
                                                    showFullDescription
                                                    description={`${contexts?.[0]} ${episode} ${contexts?.[1]} ${media?.title?.[animetitle] || media?.title?.romaji} ${contexts?.[contexts?.length - 1]}`}
                                                    className='py-2 w-full'
                                                    classNames={{
                                                        description: 'text-[11px] text-[#A1A1AA]',
                                                    }}
                                                >
                                                    <div className='flex flex-row items-center justify-between w-[290px]'>
                                                        <p className='font-semibold text-[14px] w-full'>
                                                            {((media?.title?.[animetitle] || media?.title?.romaji) || '').slice(0, 24)}
                                                            {((media?.title?.[animetitle] || media?.title?.romaji) || '').length > 24 && '...'}
                                                        </p>
                                                        <span className='text-[#f1f1f1b2] text-[10px]'>{NotificationTime(createdAt)}</span>
                                                    </div>
                                                </DropdownItem>
                                            );
                                        }) : (
                                            <DropdownItem
                                                key={"Lol"}
                                                showFullDescription
                                                className='py-3 w-full text-center'
                                            >
                                                No Notifications!
                                            </DropdownItem>
                                        )
                                    )}
                                    {selectedTimeframe === 'Today' && todayNotifications?.length > 0 &&
                                        <DropdownItem
                                            key={"delete"}
                                            showFullDescription
                                            className='py-2 w-full text-xl text-default-500 flex-shrink-0'
                                            color="danger"
                                        >
                                            <Link href={`/user/notifications`} className='w-full h-full block '>Show all</Link>
                                        </DropdownItem>
                                    }
                                    {selectedTimeframe !== 'Today' && notifications?.length > 0 &&
                                        <DropdownItem
                                            key={"delete"}
                                            showFullDescription
                                            className='py-2 w-full text-xl text-default-500 flex-shrink-0'
                                            color="danger"
                                        >
                                            <Link href={`/user/notifications`} className='w-full h-full block '>Show all</Link>
                                        </DropdownItem>
                                    }
                                </DropdownSection>

                            </DropdownMenu>
                        </Dropdown>
                    )}
                </div>
                <Dropdown placement="bottom-end" classNames={{
                    base: "before:bg-default-200",
                    content: "py-1 px-1 border border-default-200 bg-gradient-to-br from-white to-default-200 dark:from-default-50 dark:to-black",
                }}>
                    <DropdownTrigger>
                        <Avatar
                            isBordered
                            isDisabled={status === 'loading'}
                            as="button"
                            className="transition-transform w-[27px] h-[27px] backdrop-blur-sm"
                            color="secondary"
                            name={data?.user?.name}
                            size="sm"
                            src={data?.user?.image?.large || data?.user?.image?.medium || "https://i.pravatar.cc/150?u=a042581f4e29026704d"}
                        />
                    </DropdownTrigger>
                    {isLoggedIn ? (
                        <DropdownMenu aria-label="Profile Actions" variant="flat">
                            <DropdownItem key="info" className="h-14 gap-2">
                                <p className="font-semibold">Signed in as</p>
                                <p className="font-semibold">{data?.user?.name}</p>
                            </DropdownItem>
                            <DropdownItem key="profile" startContent={<ProfileIcon className={iconClasses} />}>
                            <Link href={`/user/profile`} className='w-full h-full block '>Profile</Link>
                                </DropdownItem>
                            <DropdownItem key="help_and_feedback" onPress={onOpen} startContent={<FeedbackIcon className={iconClasses} />}>Help & Feedback</DropdownItem>
                            <DropdownItem key="settings" startContent={<SettingsIcon className={iconClasses} />}>
                                <Link href={`/settings`} className='w-full h-full block '>Settings</Link>
                            </DropdownItem>
                            <DropdownItem key="logout" color="danger" startContent={<LogoutIcon className={iconClasses} />}>
                                <button className="font-semibold outline-none border-none w-full h-full block text-left" onClick={() => signOut('AniListProvider')}>Log Out</button>
                            </DropdownItem>
                        </DropdownMenu>
                    ) : (
                        <DropdownMenu aria-label="Profile Actions" variant="flat">
                            <DropdownItem key="notlogprofile" startContent={<LoginIcon className={iconClasses} />}>
                                <button className="font-semibold outline-none border-none w-full h-full block text-left" onClick={() => signIn('AniListProvider')}>Login With Anilist</button>
                            </DropdownItem>
                            <DropdownItem key="notloghelp_and_feedback" onPress={onOpen} startContent={<FeedbackIcon className={iconClasses} />}>Help & Feedback</DropdownItem>
                            <DropdownItem key="settings" startContent={<SettingsIcon className={iconClasses} />}>
                                <Link href={`/settings`} className='w-full h-full block '>Settings</Link>
                            </DropdownItem>
                        </DropdownMenu>
                    )}
                </Dropdown>
                <Feedbackform isOpen={isOpen} onOpen={onOpen} onOpenChange={onOpenChange} />
            </div>
        </motion.nav>
    )
}

export default Navbarcomponent
