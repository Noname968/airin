"use client"
import { Fragment, useEffect, useRef, useState } from "react";
import { Combobox, Dialog, Transition } from "@headlessui/react";
import axios from "axios";
import Link from 'next/link'
import UseDebounce from "@/utils/UseDebounce";
import { AdvancedSearch } from "@/lib/Anilistfunctions";
import { useRouter } from 'next/navigation';
import { useTitle, useSearchbar } from '@/lib/store';
import { useStore } from 'zustand';

function Search() {
    const router = useRouter();
    const animetitle = useStore(useTitle, (state) => state.animetitle);
    const Isopen = useStore(useSearchbar, (state) => state.Isopen);
    const [query, setQuery] = useState("");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const debouncedSearch = UseDebounce(query, 500);
    const [nextPage, setNextPage] = useState(false);

    let focusInput = useRef(null);

    async function searchdata() {
        setLoading(true);
        // const res = await axios.get(
        //     // `https://api.anify.tv/search/anime/${query} `
        //     `https://consumet-anime-api.vercel.app/meta/anilist/advanced-search`,{ params: { query:query,sort:["POPULARITY_DESC","SCORE_DESC","FAVOURITES","TRENDING"] } }

        // );
        const res = await AdvancedSearch(debouncedSearch);
        setData(res?.media)
        setNextPage(res?.pageInfo?.hasNextPage);
        console.log(res);
        setLoading(false);
    }

    useEffect(() => {
        if (debouncedSearch) {
            searchdata();
        }
    }, [debouncedSearch]);

    function closeModal() {
        useSearchbar.setState({ Isopen: false });
    }

    return (
        <Transition appear show={Isopen} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-[99999]"
                initialFocus={focusInput}
                onClose={closeModal}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/90" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-200"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-100"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-2xl max-h-[68dvh] transform text-left transition-all">
                                <Combobox
                                    as="div"
                                    className="max-w-[600px] mx-auto rounded-lg shadow-2xl relative flex flex-col"
                                    onChange={(e) => {
                                        useSearchbar.setState({ Isopen: false });
                                        setData(null);
                                        setQuery("");
                                    }}
                                >
                                    <div className="flex justify-between py-1">
                                        <div className="flex items-center px-2 gap-2">
                                            <p className="my-1">For quick access :</p>
                                            <div className="bg-[#1a1a1f] text-white text-xs font-bold px-2 py-1 rounded-md">CTRL</div>
                                            <span>+</span>
                                            <div className="bg-[#1a1a1f] text-white text-xs font-bold px-2 py-1 rounded-md">S</div>
                                        </div>
                                        <div className="mx-1 bg-[#1a1a1f] text-xs font-bold px-2 py-1 rounded-lg flex items-center justify-center">Anime</div>
                                    </div>
                                    <div className="flex items-center text-base font-medium rounded-lg bg-[#1a1a1f]">
                                        <Combobox.Input
                                            ref={focusInput}
                                            className="p-4 text-white w-full bg-transparent border-0 outline-none"
                                            placeholder="Search Anime..."
                                            onChange={(event) => setQuery(event.target.value)}
                                            onKeyDown={(event) => {
                                                if (event.key === "Enter") {
                                                    useSearchbar.setState({ Isopen: false });
                                                    router.push(`/anime/catalog?search=${encodeURIComponent(event.target.value)}`);
                                                    setData(null);
                                                    setQuery("");
                                                }
                                            }}
                                            autoComplete="off"
                                        />
                                    </div>
                                    <Combobox.Options
                                        static
                                        className="bg-[#1a1a1f] rounded-xl mt-2 max-h-[50dvh] overflow-y-auto flex flex-col scrollbar-thin scrollbar-thumb-primary scrollbar-thumb-rounded "
                                    >
                                        {!loading ? (
                                            <Fragment>
                                                {data?.length > 0
                                                    ? data?.map((item) => (
                                                        <Combobox.Option
                                                            key={item.id}
                                                            value={item.id}
                                                            className={({ active }) =>
                                                                `flex items-center gap-3 py-[8px] px-5 border-b border-solid border-gray-800  ${active ? "bg-black/20 cursor-pointer" : ""
                                                                }`
                                                            }>
                                                            <Link href={`/anime/info/${item.id}`} onClick={() => { useSearchbar.setState({ Isopen: false }) }}>
                                                                <div className="shrink-0">
                                                                    <img
                                                                        src={item.image || item.coverImage.large}
                                                                        alt="image"
                                                                        width={52}
                                                                        height={70}
                                                                        className="rounded"
                                                                    />
                                                                </div>
                                                            </Link>
                                                            <Link href={`/anime/info/${item.id}`} onClick={() => { useSearchbar.setState({ Isopen: false }) }}>
                                                                <div className="flex flex-col overflow-hidden">
                                                                    <p className="line-clamp-2 text-base">
                                                                        {item.title[animetitle] || item.title.romaji}
                                                                    </p>
                                                                    <span className="my-1 text-xs text-gray-400">Episodes - {item?.episodes || item?.nextAiringEpisode?.episode - 1 || "?"}</span>
                                                                    <div className="flex items-center text-gray-400 text-xs">
                                                                        <span className="flex gap-1">
                                                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 mt-[1pxd]" viewBox="0 0 1664 1600"><path fill="currentColor" d="M1664 615q0 22-26 48l-363 354l86 500q1 7 1 20q0 21-10.5 35.5T1321 1587q-19 0-40-12l-449-236l-449 236q-22 12-40 12q-21 0-31.5-14.5T301 1537q0-6 2-20l86-500L25 663Q0 636 0 615q0-37 56-46l502-73L783 41q19-41 49-41t49 41l225 455l502 73q56 9 56 46" /></svg>
                                                                            {item.averageScore / 10 || "0"}
                                                                        </span>
                                                                        <span className='mx-1 mb-[5px]'>.</span>
                                                                        <span>{item.format || item.type || "Na"}</span>
                                                                        <span className='mx-1 mb-[5px]'>.</span>
                                                                        <span> {item?.startDate?.year || "Na"}</span>
                                                                        <span className='mx-1 mb-[5px]'>.</span>
                                                                        <span>{item.status}</span>
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        </Combobox.Option>
                                                    ))
                                                    :
                                                    (query !== '' &&
                                                        <p className="flex items-center justify-center py-4 gap-1">
                                                            No results found.
                                                        </p>
                                                    )}
                                                {data && nextPage && (
                                                    <Link href={`/anime/catalog?search=${encodeURIComponent(query)}`}>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                useSearchbar.setState({ Isopen: false });
                                                                setQuery("");
                                                            }}
                                                            className="flex w-full items-center justify-center gap-2 py-4 transition duration-300 ease-in-out cursor-pointer border-none bg-[#4d148c] text-white text-base z-[5]">
                                                            View Results
                                                        </button>
                                                    </Link>
                                                )}
                                            </Fragment>
                                        ) : (
                                            query !== "" &&
                                            <div className="flex items-center justify-center py-4">
                                                Loading...
                                            </div>
                                        )}
                                    </Combobox.Options>
                                </Combobox>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}

export default Search;
