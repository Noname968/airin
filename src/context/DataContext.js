"use client"
import { createContext, useState, useContext, useEffect } from 'react';
const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [Isopen, setIsopen] = useState(false);
  const [dfprovider,setdfprovider] = useState(null);
  const [dfepisodes,setdfepisodes] = useState(null);
  const [dftype,setdftype] = useState(null);
  const [animetitle, setAnimetitle] = useState(null);
  const [nowPlaying, setNowPlaying] = useState(null);
  const [dataInfo, setDataInfo] = useState(null);
  const [subtype, setSubtype] = useState('');
  const [l,setl] = useState(null);

  const defaultSettings = {
    autoplay: false,
    autoskip: false,
    autonext: false,
    load: 'idle',
    audio: false,
    herotrailer: true,
};

const [settings, setSettings] = useState({});

useEffect(() => {
    const storedSettings = JSON.parse(localStorage.getItem('settings'));

    if (storedSettings && Object.keys(storedSettings).length > 0) {
        setSettings(storedSettings);
    } else {
        setSettings(defaultSettings);
    }
}, []);

useEffect(() => {
    if (settings && Object.keys(settings).length > 0) {
        localStorage.setItem('settings', JSON.stringify(settings));
    }
}, [settings]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('selectedLanguage');
      setAnimetitle(savedLanguage || 'english');
      setl(savedLanguage ? savedLanguage==='english' : true);
    }
  }, []);

  useEffect(() => {
    if(l!==null){
      localStorage.setItem('selectedLanguage', l?'english':'romaji');
      setAnimetitle(l ? 'english' : 'romaji');
    }
  },[l, animetitle]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedType = localStorage.getItem('selectedType');
      setSubtype(storedType || 'sub');
    }
  }, []);

  useEffect(() => {
    if(subtype){
      localStorage.setItem("selectedType", subtype);
    }
  },[subtype])

  return (
    <DataContext.Provider value={{ Isopen, setIsopen, setdfprovider, setdfepisodes,
     dfepisodes, dfprovider, dftype, setdftype, animetitle, setAnimetitle, setSettings, settings,
     nowPlaying, setNowPlaying, dataInfo, setDataInfo, subtype, setSubtype, l , setl
     }}>
      {children}
    </DataContext.Provider>
  );
};

export function ContextSearch() {
  return useContext(DataContext);
}