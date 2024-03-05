"use client"
import React, { useEffect, useState } from "react";
import { Select, SelectItem, Tooltip } from "@nextui-org/react";
import styles from '../styles/Episodesection.module.css'
import { getEpisodes } from "@/lib/getData";
import { ProvidersMap } from "@/utils/EpisodeFunctions";
import EpImageList from "./Episodelists/EpImageList";
import EpNumList from "./Episodelists/EpNumList";
import EpImgContent from "./Episodelists/EpImgContent";
import { toast } from "sonner";
import { useSubtype } from '@/lib/store';
import { useStore } from 'zustand';

function Episodesection({ data, id, progress, setUrl }) {
  const subtype = useStore(useSubtype, (state) => state.subtype);
  const subdub = ["sub", "dub"];
  const [loading, setloading] = useState(true);
  const [refreshloading, setRefreshLoading] = useState(false);
  const [dataRefreshed, setDataRefreshed] = useState(false);
  const [reversed, setReversed] = useState(false);
  const [filteredEpisodes, setFilteredEpisodes] = useState([]);
  const [selectedRange, setSelectedRange] = useState("1-100");

  const [eplisttype, setEplistType] = useState(2);
  const [showSelect, setShowSelect] = useState(false);

  const [currentEpisodes, setCurrentEpisodes] = useState(null);
  const [defaultProvider, setdefaultProvider] = useState("");
  const [subProviders, setSubProviders] = useState(null);
  const [dubProviders, setDubProviders] = useState(null);


  useEffect(() => {
    const listtype = localStorage.getItem('eplisttype');
    if (listtype) {
      setEplistType(parseInt(listtype, 10));
    }

  }, []);

  const toggleShowSelect = () => {
    setShowSelect(!showSelect);
  };

  const handleSubDub = (e) => {
    useSubtype.setState({ subtype: e.target.value })
  };

  const handleOptionClick = (option) => {
    setEplistType(option);
    localStorage.setItem('eplisttype', option.toString());
  };

  useEffect(() => {
    const fetchepisodes = async () => {
      try {
        const response = await getEpisodes(id, data?.status === "RELEASING", false);
        if (response) {
          const { subProviders, dubProviders } = ProvidersMap(response, defaultProvider, setdefaultProvider);
          setSubProviders(subProviders);
          setDubProviders(dubProviders);
        }
        setloading(false);
      } catch (error) {
        console.log(error)
        setloading(false)
      }
    }
    if (data?.type !== 'MANGA' && data?.status !== 'NOT_YET_RELEASED') {
      fetchepisodes();
    }
  }, [data?.id])

  const handleProviderChange = (event) => {
    setdefaultProvider(event.target.value);
  };

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

    setCurrentEpisodes(filteredEp);
  }, [selectedProvider, subtype, dataRefreshed]);

  const totalEpisodes = currentEpisodes?.length || 0;

  const episodeRangeOptions = [];
  if (totalEpisodes <= 100) {
    episodeRangeOptions.push({ label: `1-${totalEpisodes}`, value: `1-${totalEpisodes}` });
  } else {
    for (let i = 0; i < totalEpisodes; i += 100) {
      const start = i + 1;
      const end = Math.min(i + 100, totalEpisodes);
      const label = `${start}-${end}`;
      episodeRangeOptions.push({ label, value: `${start}-${end}` });
    }
  }

  const handleRangeChange = (e) => {
    const [start, end] = e.target.value.split('-').map(Number);
    const selectedEpisodes = currentEpisodes?.slice(start - 1, end);
    setFilteredEpisodes(selectedEpisodes);
    setSelectedRange(e.target.value);
  };

  useEffect(() => {
    const initialEpisodes = currentEpisodes?.slice(0, 100);
    setFilteredEpisodes(initialEpisodes);
  }, [currentEpisodes, totalEpisodes, dataRefreshed]);

  const reverseOrder = () => {
    setReversed(!reversed)
  }

  const refreshEpisodes = async () => {
    setRefreshLoading(true);
    try {
      const response = await getEpisodes(id, data?.status === "RELEASING", true);
      if (response) {
        const { subProviders, dubProviders } = ProvidersMap(response, defaultProvider, setdefaultProvider);
        setSubProviders(subProviders);
        setDubProviders(dubProviders);
      }
      setRefreshLoading(false);
      setDataRefreshed(true);
      toast.success("Episodes refreshed successfully!");
    } catch (error) {
      console.error("Error refreshing episodes:", error);
      toast.error("Oops! Something went wrong. If episodes don't appear, please refresh the page.");
      setRefreshLoading(false);
    }
  };

  useEffect(() => {
    if (currentEpisodes) {
      const episode = data?.nextAiringEpisode ? currentEpisodes?.find((i) => i.number === progress + 1) : currentEpisodes[0]
      if (episode) {
        const watchurl = `/anime/watch?id=${data?.id}&host=${defaultProvider}&epid=${encodeURIComponent(episode?.id)}&ep=${episode?.number}&type=${subtype}`;
        setUrl(watchurl);
      } else {
        setUrl(null);
      }
    }
  }, [currentEpisodes, progress]);

  return (
    <div className={styles.episodesection}>
      <div className={styles.eptopsection}>
        <div className={styles.epleft}>
          <div className={styles.cardhead}>
            <span className={styles.bar}></span>
            <h1 className={styles.headtitle}>Episodes</h1>
          </div>
          {data?.status !== 'NOT_YET_RELEASED' && data?.type !== 'MANGA' &&
            <Tooltip content="Refresh Episodes">
              <button className={styles.refresh} onClick={refreshEpisodes}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={`w-[22px] h-[22px] ${refreshloading ? "animate-spin" : ""}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              </button>
            </Tooltip>
          }
        </div>
        {!loading && <>
          {<>
            <div className={styles.epright}>
              <div className={styles.selects}>
                {!refreshloading && currentEpisodes?.length > 0 && <>
                  {totalEpisodes > 100 && (
                    <div className="flex flex-col w-[120px] mr-2">
                      <Select
                        label=""
                        aria-label="Episode Range"
                        placeholder={`Episodes`}
                        labelPlacement="outside"
                        selectedKeys={[selectedRange.toString()]}
                        disallowEmptySelection={true}
                        // className="w-[130px] !h-[40px] !py-0"
                        classNames={{
                          base: "!m-0 !p-0 ",
                          mainWrapper: "p-0 m-0 h-[34px]",
                          trigger: "m-0 !min-h-[34px] !max-w-[115px] pr-0",
                          value: "",
                          listbox: "m-0 p-0",
                        }}
                        radius="sm"
                        onChange={handleRangeChange}
                      >
                        {episodeRangeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                  )}
                  <div className="flex w-[133px] flex-col gap-2 mr-3">
                    <Select
                      label=""
                      aria-label="Switch"
                      placeholder={`Switch`}
                      labelPlacement="outside"
                      selectedKeys={[defaultProvider]}
                      // className="max-w-[150px] !h-[40px] !py-0"
                      classNames={{
                        base: "!m-0 !p-0 ",
                        mainWrapper: "p-0 m-0 h-[34px]",
                        trigger: "m-0 !min-h-[34px] !max-w-[128px] pr-0",
                        value: "",
                        listbox: "m-0 p-0",
                      }}
                      radius="sm"
                      onChange={handleProviderChange}
                      disallowEmptySelection={true}
                    >
                      {subProviders?.map((item) => (
                        <SelectItem key={item.providerId} value={item.providerId}>
                          {item.providerId}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                </>}
                <div className="flex w-[75px] flex-col gap-2 mr-2">
                  <Select
                    label=""
                    aria-label="Switch"
                    placeholder={`Switch`}
                    labelPlacement="outside"
                    selectedKeys={[subtype]}
                    classNames={{
                      base: "!m-0 !p-0 ",
                      mainWrapper: "p-0 m-0 !h-[34px]",
                      trigger: "m-0 !min-h-[34px] !max-w-[70px] pr-0",
                      value: "",
                      listbox: "m-0 p-0",
                    }}
                    radius="sm"
                    onChange={handleSubDub}
                    disallowEmptySelection={true}
                  >
                    {subdub.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              </div>
              <div className={styles.epchangeicons}>
                <div className={styles.epchangeopt}>
                  <span
                    className={`mx-[6px] cursor-pointer ${eplisttype === 1 ? 'selected' : ''}`}
                    onClick={() => handleOptionClick(1)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke={`${eplisttype === 1 ? '#ca1313' : 'currentColor'}`} className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                    </svg>
                  </span>
                  <span
                    className={`mx-[6px] cursor-pointer ${eplisttype === 2 ? 'selected' : ''}`}
                    onClick={() => handleOptionClick(2)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke={`${eplisttype === 2 ? '#ca1313' : 'currentColor'}`} className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122" />
                    </svg>

                  </span>
                  <span
                    className={`mx-[6px] cursor-pointer ${eplisttype === 3 ? 'selected' : ''}`}
                    onClick={() => handleOptionClick(3)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke={`${eplisttype === 3 ? '#ca1313' : 'currentColor'}`} className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
                    </svg>

                  </span>
                </div>
                <button className={styles.refresh} onClick={reverseOrder}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-[22px] h-[22px]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
                  </svg>
                </button>
                <span className={styles.toggleicons} onClick={toggleShowSelect}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                </span>
              </div>
            </div>
          </>
          }
        </>}
      </div>
      {showSelect && (
        <div className={styles.selectmobile}>
          <div className="flex w-[75px] flex-col gap-2 mr-2">
            <Select
              label=""
              aria-label="Switch"
              placeholder={`Switch`}
              labelPlacement="outside"
              selectedKeys={[subtype]}
              classNames={{
                base: "!m-0 !p-0 ",
                mainWrapper: "p-0 m-0 !h-[34px]",
                trigger: "m-0 !min-h-[34px] !max-w-[70px] pr-0",
                value: "",
                listbox: "m-0 p-0",
              }}
              radius="sm"
              onChange={handleSubDub}
              disallowEmptySelection={true}
            >
              {subdub.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </Select>
          </div>
          {totalEpisodes > 100 && (
            <div className="flex flex-col w-[120px] mr-2">
              <Select
                label=""
                aria-label="Episode Range"
                placeholder={`Episodes`}
                labelPlacement="outside"
                selectedKeys={[selectedRange.toString()]}
                disallowEmptySelection={true}
                // className="w-[130px] !h-[40px] !py-0"
                classNames={{
                  base: "!m-0 !p-0 ",
                  mainWrapper: "p-0 m-0 h-[34px]",
                  trigger: "m-0 !min-h-[34px] !max-w-[115px] pr-0",
                  value: "",
                  listbox: "m-0 p-0",
                }}
                radius="sm"
                onChange={handleRangeChange}
              >
                {episodeRangeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
            </div>
          )}
          <div className="flex w-[133px] flex-col gap-2 mr-3">
            <Select
              label=""
              aria-label="Switch"
              placeholder={`Switch`}
              labelPlacement="outside"
              selectedKeys={[defaultProvider]}
              // className="max-w-[150px] !h-[40px] !py-0"
              classNames={{
                base: "!m-0 !p-0 ",
                mainWrapper: "p-0 m-0 h-[34px]",
                trigger: "m-0 !min-h-[34px] !max-w-[128px] pr-0",
                value: "",
                listbox: "m-0 p-0",
              }}
              radius="sm"
              onChange={handleProviderChange}
              disallowEmptySelection={true}
            >
              {subProviders?.map((item) => (
                <SelectItem key={item.providerId} value={item.providerId}>
                  {item.providerId}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>
      )}
      {loading && (
        <>
          {data?.type === 'MANGA' ? (
            <div className="text-[17px] font-semibold">
              <p className="text-center mt-4">Coming Soon! </p>
              <p className="text-center mb-4 ">Cannot Fetch Manga, Feature Coming Soon.</p>
            </div>
          ) : data?.status === 'NOT_YET_RELEASED' ? (
            <div className="text-[17px] font-semibold">
              <p className="text-center mt-4">Coming Soon! </p>
              <p className="text-center mb-4">Sorry, this anime isn't out yet. Keep an eye out for updates!</p>
            </div>

          ) : (
            <div className="text-[17px] font-semibold">
              <p className="text-center mt-4 mb-1">Please Wait... </p>
              <p className="text-center mb-4">Loading Episode Data</p>
            </div>
          )}
        </>
      )}

      {refreshloading &&
        <div className="text-[17px] font-semibold">
          <p className="text-center mt-4 mb-1">Please Wait... </p>
          <p className="text-center mb-4">Refreshing Episode Data</p>
        </div>
      }
      {!loading && !refreshloading && filteredEpisodes?.length < 1 && (
        <div className="text-[17px] font-semibold">
          <p className="text-center mt-4">Oh no! </p>
          <p className="text-center mb-4">This anime is currently unavailable. Check back later for updates!</p>
        </div>
      )}
      {!loading && !refreshloading && (
        <>
          {eplisttype === 3 && (
            <div className={styles.epnumlist}>
              <EpNumList data={data} epdata={reversed ? filteredEpisodes.reverse() : filteredEpisodes} defaultProvider={defaultProvider} subtype={subtype} />
            </div>
          )}
          {eplisttype === 2 && (
            <div className={styles.epimgconist}>
              <EpImgContent data={data} epdata={reversed ? filteredEpisodes.reverse() : filteredEpisodes} defaultProvider={defaultProvider} subtype={subtype} />
            </div>
          )}
          {eplisttype === 1 && (
            <div className={styles.epimagelist}>
              <EpImageList data={data} epdata={reversed ? filteredEpisodes.reverse() : filteredEpisodes} defaultProvider={defaultProvider} subtype={subtype} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Episodesection;
