"use client"
import React, { useEffect, useState } from "react";
import styles from '../../styles/PlayerEpisodeList.module.css'
import { getEpisodes } from "@/lib/getData";
import { ProvidersMap } from "@/utils/EpisodeFunctions";
import { useRouter } from 'next-nprogress-bar';
import EpImgContent from "../Episodelists/EpImgContent";
import EpNumList from "../Episodelists/EpNumList";
import { Select, SelectItem, Tooltip } from "@nextui-org/react";
import Skeleton from "react-loading-skeleton";
import { useSubtype } from '@/lib/store';
import { useStore } from 'zustand';

function PlayerEpisodeList({ id, data, onprovider, setwatchepdata, epnum }) {
  const subtype = useStore(useSubtype, (state) => state.subtype);
  const router = useRouter();

  const [loading, setloading] = useState(true);
  const [episodeData, setepisodeData] = useState(null);
  const [currentEpisodes, setCurrentEpisodes] = useState([]);
  const [defaultProvider, setdefaultProvider] = useState(null);
  const [subProviders, setSubProviders] = useState(null);
  const [dubProviders, setDubProviders] = useState(null);
  const [providerChanged, setProviderChanged] = useState(true);
  const [refreshloading, setRefreshLoading] = useState(false);
  const [dataRefreshed, setDataRefreshed] = useState(false);
  const [eplisttype, setEplistType] = useState(2);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredEp, setFilteredEp] = useState([]);
  const itemsPerPage = 35;

  useEffect(() => {
    const startIndex = (parseInt(currentPage) - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const slicedep = currentEpisodes.slice(startIndex, endIndex) || [];
    setFilteredEp(slicedep);
  }, [currentEpisodes, currentPage]);

  useEffect(() => {
    if (epnum) {
      const calculatedPage = Math.ceil(epnum / itemsPerPage);
      setCurrentPage(calculatedPage <= 0 ? 1 : calculatedPage);
    }
  }, [epnum])

  useEffect(() => {
    const listtype = localStorage.getItem('eplisttype');
    if (listtype) {
      if (parseInt(listtype, 10) === 1) {
        setEplistType(2);
      } else {
        setEplistType(parseInt(listtype, 10));
      }
    }
  }, []);


  const handleOptionClick = (option) => {
    setEplistType(option);
    localStorage.setItem('eplisttype', option.toString());
  };

  useEffect(() => {
    const fetchepisodes = async () => {
      try {
        const response = await getEpisodes(id, data.status === "RELEASING", false);
        setepisodeData(response);
        setloading(false)
      } catch (error) {
        console.log(error)
        setloading(false)
      }
    }
    fetchepisodes();
  }, [id]);

  useEffect(() => {
    const { subProviders, dubProviders } = ProvidersMap(episodeData, defaultProvider, setdefaultProvider);
    setSubProviders(subProviders);
    setDubProviders(dubProviders);
  }, [episodeData]);

  const handleProviderChange = (provider, subvalue = "sub") => {
    setdefaultProvider(provider);
    useSubtype.setState({ subtype: subvalue });
    setProviderChanged(true);
  };

  useEffect(() => {
    setdefaultProvider(onprovider);
    setProviderChanged(true);
    console.log(onprovider);
  }, [])

  const selectedProvider =
    subtype === 'sub'
      ? subProviders?.find((provider) => provider.providerId === defaultProvider)
      : dubProviders?.find((provider) => provider.providerId === defaultProvider);

  useEffect(() => {
    const episodes = selectedProvider?.episodes || [];
    const filteredEp =
      selectedProvider?.consumet === true
        ? subtype === 'sub' ? episodes.sub : episodes.dub
        : subtype === 'dub'
          ? episodes.filter((item) => item.hasDub === true) || []
          : episodes.slice(0) || [];
    setwatchepdata(filteredEp);
    setCurrentEpisodes(filteredEp);
    if (filteredEp) {
      setProviderChanged(false);
    }
  }, [selectedProvider, subtype, defaultProvider]);

  useEffect(() => {
    if (!providerChanged && currentEpisodes[epnum - 1]?.id) {
      // Use  setTimeout to wait for the component to re-render
      router.push(`/anime/watch?id=${id}&host=${defaultProvider}&epid=${encodeURIComponent(currentEpisodes[epnum - 1]?.id)}&ep=${epnum}&type=${subtype}`);
      setTimeout(() => {
      }, 0);
    }
  }, [providerChanged]);

  const refreshEpisodes = async () => {
    setRefreshLoading(true);
    try {
      const response = await getEpisodes(id, data.status === "RELEASING", true);
      if (response) {
        const { subProviders, dubProviders } = ProvidersMap(response, defaultProvider, setdefaultProvider);
        setSubProviders(subProviders);
        setDubProviders(dubProviders);
      }
      setRefreshLoading(false);
      setDataRefreshed(true);
    } catch (error) {
      console.error("Error refreshing episodes:", error);
      setRefreshLoading(false);
    }
  };

  const reversetoggle = () => {
    setCurrentPage(1)
    setCurrentEpisodes((prev) => [...prev].reverse());
  }

  return (
    <div className={styles.episodelist}>
      {loading ? (
        <>
          {[1].map((item) => (
            <Skeleton
              key={item}
              className="bg-[#18181b] flex w-full h-[100px] rounded-lg scale-100 transition-all duration-300 ease-out"
            />
          ))}
        </>
      ) : (
        <div className={styles.episodetop}>
          <div className={styles.episodetopleft}>
            <span className="text-xs lg:text-xs">You are Watching</span>
            <span className="font-bold text-sm md:text-white">Episode {epnum}</span>
            <span className="!leading-tight !text-[0.8rem] flex flex-col items-center justify-center text-center">If current server doesn't work please try other servers beside.</span>
          </div>
          <div className={styles.episodetopright}>
            <div className={styles.episodesub}>
              <span className={styles.episodetypes}><svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 576 512" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 96C0 60.7 28.7 32 64 32H512c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM200 208c14.2 0 27 6.1 35.8 16c8.8 9.9 24 10.7 33.9 1.9s10.7-24 1.9-33.9c-17.5-19.6-43.1-32-71.5-32c-53 0-96 43-96 96s43 96 96 96c28.4 0 54-12.4 71.5-32c8.8-9.9 8-25-1.9-33.9s-25-8-33.9 1.9c-8.8 9.9-21.6 16-35.8 16c-26.5 0-48-21.5-48-48s21.5-48 48-48zm144 48c0-26.5 21.5-48 48-48c14.2 0 27 6.1 35.8 16c8.8 9.9 24 10.7 33.9 1.9s10.7-24 1.9-33.9c-17.5-19.6-43.1-32-71.5-32c-53 0-96 43-96 96s43 96 96 96c28.4 0 54-12.4 71.5-32c8.8-9.9 8-25-1.9-33.9s-25-8-33.9 1.9c-8.8 9.9-21.6 16-35.8 16c-26.5 0-48-21.5-48-48z"></path></svg> SUB: </span>
              {subProviders?.map((item) => (
                <div key={item.providerId} value={item.providerId} className={item.providerId === defaultProvider && subtype === 'sub' ? styles.providerselected : styles.provider} onClick={() => handleProviderChange(item.providerId, "sub")}>
                  {item.providerId}
                </div>
              ))}
            </div>
            {dubProviders?.length > 0 && (
              <div className={styles.episodedub}>
                <span className={styles.episodetypes}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
                </svg> DUB: </span>
                {dubProviders?.map((item) => (
                  <div key={item.providerId} value={item.providerId} className={item.providerId === defaultProvider && subtype === 'dub' ? styles.providerselected : styles.provider} onClick={() => handleProviderChange(item.providerId, "dub")}>
                    {item.providerId}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      <div className={styles.episodebottom}>
        {currentEpisodes?.length === 0 && !loading ? (
          <div className='text-center bg-[#18181b] py-2 rounded-lg'>No episodes found.</div>
        ) : (
          <>
            {loading ? (
              <>
                {[1].map((item) => (
                  <Skeleton
                    key={item}
                    className="bg-[#18181b] flex w-full h-[50px] rounded-lg scale-100 transition-all duration-300 ease-out"
                  />
                ))}
              </>
            ) : (
              <>
                <div className={styles.episodetitle}>
                  <div className={styles.epleft}>
                    <h3 className={styles.epheading}>Episodes</h3>
                    <Tooltip content="Refresh Episodes">
                      <button className={styles.refresh} onClick={refreshEpisodes}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={`w-[22px] h-[22px] ${refreshloading ? "animate-spin" : ""}`}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                      </button>
                    </Tooltip>
                  </div>
                  <div className={styles.epright}>
                    {currentEpisodes.length > itemsPerPage && (
                      <>
                        <Select
                          label=""
                          aria-label="Episode Range"
                          placeholder={`Episodes`}
                          labelPlacement="outside"
                          selectedKeys={[currentPage.toString()]}
                          disallowEmptySelection={true}
                          classNames={{
                            base: "!m-0 !p-0 ",
                            mainWrapper: "p-0 m-0 h-[34px]",
                            trigger: "m-0 !min-h-[30px] w-[120px] pr-0",
                            value: "",
                            listbox: "m-0 p-0",
                          }}
                          radius="sm"
                          onChange={(e) => setCurrentPage(parseInt(e.target.value))}
                        >
                          {Array.from({ length: Math.ceil(currentEpisodes?.length / itemsPerPage) }, (_, i) => i + 1).map((page) => {
                            const startIdx = (page - 1) * itemsPerPage + 1;
                            const endIdx = Math.min(page * itemsPerPage, currentEpisodes?.length);

                            return (
                              <SelectItem key={page} value={page}>
                                {`${startIdx}-${endIdx}`}
                              </SelectItem>
                            )
                          })}
                        </Select>
                      </>)}
                    <span
                      className={` cursor-pointer ${eplisttype === 2 ? 'selected' : ''}`}
                      onClick={() => handleOptionClick(2)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke={`${eplisttype === 2 ? '#ca1313' : 'currentColor'}`} className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122" />
                      </svg>

                    </span>
                    <span
                      className={` cursor-pointer ${eplisttype === 3 ? 'selected' : ''}`}
                      onClick={() => handleOptionClick(3)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke={`${eplisttype === 3 ? '#ca1313' : 'currentColor'}`} className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
                      </svg>
                    </span>
                    <span onClick={reversetoggle} className="cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
                      </svg>
                    </span>
                  </div>
                </div>
                {eplisttype === 2 && (
                  <div className="mt-3">
                    <EpImgContent data={data} epdata={filteredEp} defaultProvider={defaultProvider} subtype={subtype} epnum={epnum} />
                  </div>
                )}
                {eplisttype === 3 && (
                  <div className={styles.epnumlist}>
                    <EpNumList data={data} epdata={filteredEp} defaultProvider={defaultProvider} subtype={subtype} epnum={epnum} />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default PlayerEpisodeList;
