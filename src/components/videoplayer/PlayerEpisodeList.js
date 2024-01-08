"use client"
import React, { useEffect, useState } from "react";
import { Select, SelectItem, Tooltip } from "@nextui-org/react";
import styles from '../../styles/PlayerEpisodeList.module.css'
import Link from 'next/link'
import { getEpisodes } from "@/lib/getData";
import { ProvidersMap } from "@/utils/EpisodeFunctions";

function PlayerEpisodeList({ data, episodeData, onprovider }) {
  const subdub = ["sub", "dub"];
  const [subtype, setSubtype] = useState('sub');

  useEffect(() => {
    const storedType = localStorage.getItem('selectedType');
    if (storedType) {
      setSubtype(storedType);
    }
  }, []);
  const [refreshloading, setRefreshLoading] = useState(false);
  const [reversed, setReversed] = useState(false);
  const [filteredEpisodes, setFilteredEpisodes] = useState([]);
  const [selectedRange, setSelectedRange] = useState("1-100");
  const [dataRefreshed, setDataRefreshed] = useState(false);

  const [currentEpisodes, setCurrentEpisodes] = useState([]);
  const [consumetProvider, setConsumetProvider] = useState(null);
  const [defaultProvider, setdefaultProvider] = useState(null);
  const [allProviders, setAllProviders] = useState(null);

  useEffect(() => {
    const providers = ProvidersMap(episodeData, setConsumetProvider, defaultProvider, setdefaultProvider, subtype);
    setAllProviders(providers);
  }, [episodeData, subtype]);  

  const handleProviderChange = (event) => {
    setdefaultProvider(event.target.value);
  };

  useEffect(()=>{
    setdefaultProvider(onprovider)
  },[])

  const selectedProvider = allProviders?.find((provider) => provider.providerId === defaultProvider);

useEffect(() => {
  if (selectedProvider?.consumet === true) {
    // console.log(consumetProvider)
    setCurrentEpisodes(consumetProvider);
  } else {
    setCurrentEpisodes(
      subtype === 'dub'
        ? selectedProvider?.episodes?.filter((item) => item.hasDub === true) || []
        : selectedProvider?.episodes?.slice(0) || []
    );
  }
}, [selectedProvider, consumetProvider, subtype, dataRefreshed]);

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
    const selectedEpisodes = currentEpisodes.slice(start - 1, end);
    setFilteredEpisodes(selectedEpisodes);
    setSelectedRange(e.target.value);
  };

  useEffect(() => {
    const initialEpisodes = currentEpisodes?.slice(0, 100);
    setFilteredEpisodes(initialEpisodes);
  }, [currentEpisodes,totalEpisodes, dataRefreshed]);

  const reverseOrder = () => {
    setReversed(!reversed)
  }

  const handleSubDub = (e) => {
    setSubtype(e.target.value);
    localStorage.setItem("selectedType", e.target.value);
  };

  const refreshEpisodes = async () => {
    setRefreshLoading(true);
    try {
      const response = await getEpisodes(data.id, data.status === "RELEASING", true);
      const providers = ProvidersMap(response, setConsumetProvider, defaultProvider, setdefaultProvider, subtype);
      setAllProviders(providers);
      setRefreshLoading(false);
      setDataRefreshed(true);
    } catch (error) {
      console.error("Error refreshing episodes:", error);
      setRefreshLoading(false);
    }
  };

  return (
    <div className={styles.episodesection}>
      <div className={styles.eptopsection}>
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
        {!refreshloading && 
        <div className={styles.epright}>
        <div className="flex w-[80px] max-w-[80px] flex-col gap-2 mr-2">
          <Select
            label=""
            aria-label="Switch"
            placeholder={`Switch`}
            labelPlacement="outside"
            selectedKeys={[subtype]}
            className="max-w-[80px] !h-[40px] !py-0"
            onChange={handleSubDub}
          >
            {subdub.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </Select>
        </div>
        <div className="flex w-[150px] max-w-[150px] flex-col gap-2 mr-2">
          <Select
            label=""
            aria-label="Switch"
            placeholder={`Switch`}
            labelPlacement="outside"
            selectedKeys={[defaultProvider]}
            className="max-w-[150px] !h-[40px] !py-0"
            onChange={handleProviderChange}
          >
            {allProviders?.map((item) => (
              <SelectItem key={item.providerId} value={item.providerId}>
                {item.providerId}
              </SelectItem>
            ))}
          </Select>
        </div>
        <div className="flex flex-col max-w-[130px]">
          {totalEpisodes > 100 && (
            <Select
              label=""
              aria-label="Episode Range"
              placeholder={`Episodes`}
              labelPlacement="outside"
              selectedKeys={[selectedRange.toString()]}
              className="w-[130px] !h-[40px] !py-0"
              onChange={handleRangeChange}
            >
              {episodeRangeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </Select>
          )}
        </div>
        <button className={styles.refresh} onClick={reverseOrder}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-[22px] h-[22px]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
          </svg>
        </button>
      </div>
       }
      </div>
      <div className={styles.epbottomsection}>
       {refreshloading ? <p>Refreshing Episode Data</p>:
       <>
        {filteredEpisodes?.length === 0 ? (
          <p>No episodes available</p>
        ) : (
          reversed
            ? filteredEpisodes
              .slice()
              .reverse()
              .map((episode) => (
                <Link
                href={`/anime/watch/${data.id}/${defaultProvider}/${episode?.number}?epid=${encodeURIComponent(
                  episode?.id
                )}&type=${subtype}`}
                  key={episode.id}
                  scroll={false}
                >
                  <div className={styles.epdiv}>{episode.number}</div>
                </Link>
              ))
            : filteredEpisodes?.map((episode) => (
              <Link 
              href={`/anime/watch/${data.id}/${defaultProvider}/${episode?.number}?epid=${encodeURIComponent(
                episode?.id
              )}&type=${subtype}`}
              key={episode.id}
                scroll={false}
              >
                <div className={styles.epdiv}>{episode.number}</div>
              </Link>
            ))
        )}
       </>
       }
      </div>
    </div>
  );
}

export default PlayerEpisodeList;
