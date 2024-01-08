"use client"
import { createContext, useState, useContext, useEffect } from 'react';
const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [Isopen, setIsopen] = useState(false);
  const [dfprovider,setdfprovider] = useState(null);
  const [dfepisodes,setdfepisodes] = useState(null);
  const [dftype,setdftype] = useState(null);
  const [animetitle, setAnimetitle] = useState('english');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('selectedLanguage');
      setAnimetitle(savedLanguage || 'english');
    }
  }, []);

  const changeLanguage = (newLanguage) => {
    setAnimetitle(newLanguage);
    localStorage.setItem('selectedLanguage', newLanguage);
  };


  return (
    <DataContext.Provider value={{ Isopen, setIsopen,setdfprovider,setdfepisodes,dfepisodes,dfprovider, dftype,setdftype,animetitle,changeLanguage}}>
      {children}
    </DataContext.Provider>
  );
};

export function ContextSearch() {
  return useContext(DataContext);
}