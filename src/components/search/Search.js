"use client"
import { Fragment, useEffect, useRef, useState } from "react";
import { Combobox, Dialog, Transition } from "@headlessui/react";
import axios from "axios";
import { ContextSearch } from "@/context/DataContext";
import Link from 'next/link'
import UseDebounce from "@/utils/UseDebounce";

function Search() {
    const { Isopen, setIsopen } = ContextSearch();
    const [query, setQuery] = useState("");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const debouncedSearch = UseDebounce(query, 500)

    let focusInput = useRef(null);

    async function searchdata() {
        setLoading(true);
        const res = await axios.get(
            // `https://api.anify.tv/search/anime/${query} `
            `https://api-consumet-org-ruddy-three.vercel.app/meta/anilist/advanced-search`,{ params: { query:query,sort:["POPULARITY_DESC","SCORE_DESC","FAVOURITES","TRENDING"] } }

        );
        setData(res.data)
        console.log(res.data);
        setLoading(false);
    }

    useEffect(() => {
        if (debouncedSearch) {
            searchdata();
        }
    }, [debouncedSearch]);

    function closeModal() {
        setIsopen(false);
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
                    <div className="flex min-h-full items-center justify-center p-4  text-center">
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
                                        navigate(`/info/${e}`);
                                        setIsopen(false);
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
                                        <div className="mx-2 bg-[#1a1a1f] text-xs font-bold px-2 py-1 rounded-md flex items-center justify-center">Anime</div>
                                    </div>
                                    <div className="flex items-center text-base font-medium rounded bg-[#1a1a1f]">
                                        <Combobox.Input
                                            ref={focusInput}
                                            className="p-5 text-white w-full bg-transparent border-0 outline-none"
                                            placeholder="Search Anime..."
                                            onChange={(event) => setQuery(event.target.value)}
                                            onKeyDown={(event) => {
                                                if (event.key === "Enter" && data?.results?.length > 0) {
                                                    setIsopen(false);
                                                    setData(null);
                                                    setQuery("");
                                                }
                                            }}
                                            autoComplete="off"
                                        />
                                    </div>
                                    <Combobox.Options
                                        static
                                        className="bg-[#1a1a1f] rounded mt-2 max-h-[50dvh] overflow-y-auto flex flex-col scrollbar-thin scrollbar-thumb-primary scrollbar-thumb-rounded "
                                    >
                                        {!loading ? (
                                            <Fragment>
                                                {data?.results?.length > 0
                                                    ? data?.results.map((item) => (
                                                        <Combobox.Option
                                                            key={item.id}
                                                            value={item.id}
                                                            className={({ active }) =>
                                                                `flex items-center gap-3 py-[8px] px-5 border-b border-solid border-gray-800  ${active ? "bg-black/20 cursor-pointer" : ""
                                                                }`
                                                            }>
                                                            <div className="shrink-0">
                                                                <img
                                                                    src={item.image || item.coverImage}
                                                                    alt="image"
                                                                    width={52}
                                                                    height={70}
                                                                    className="rounded"
                                                                />
                                                            </div>
                                                            <div className="flex flex-col overflow-hidden">
                                                                <Link href={`/anime/info/${item.id}`} onClick={()=>{setIsopen(false)}}>
                                                                    <p className="line-clamp-2 text-base">
                                                                        {item.title.english || item.title.romaji}
                                                                    </p>
                                                                </Link>
                                                                <span className="my-1 text-xs text-gray-400">Episodes - {item.totalEpisodes || "Na"}</span>
                                                                <div className="flex items-center text-gray-400 text-xs">
                                                                    <span><span className="fa fa-star"></span> {item.rating / 10 || item.averageRating}</span>
                                                                    <span className='mx-1 mb-[5px]'>.</span>
                                                                    <span>{item.type || "Na"}</span>
                                                                    <span className='mx-1 mb-[5px]'>.</span>
                                                                    <span> {item.releaseDate || item.year || "Na"}</span>
                                                                    <span className='mx-1 mb-[5px]'>.</span>
                                                                    <span>{item.status}</span>
                                                                </div>
                                                            </div>
                                                        </Combobox.Option>
                                                    ))
                                                    :
                                                    (query !== '' &&
                                                        <p className="flex items-center justify-center py-4 gap-1">
                                                            No results found.
                                                        </p>
                                                    )}
                                                {data?.hasNextPage && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            //  navigate(`/advancedsearch/${query}`)
                                                            setIsopen(false);
                                                            setQuery("");
                                                        }}
                                                        className="flex items-center justify-center gap-2 py-4 transition duration-300 ease-in-out cursor-pointer border-none bg-purple-900 text-white text-base">
                                                        <span>View Results</span>
                                                    </button>
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
