import { create } from "zustand";
import { persist } from 'zustand/middleware'

export const useSettings = create(
    persist(
        (set) => ({
            settings: {
                autoplay: false,
                autoskip: false,
                autonext: false,
                load: 'idle',
                audio: false,
                herotrailer: true,
            },
            setSettings: (settings) => set({ settings }),
        }),
        {
            name: "settings",
        }
    )
);

export const useTitle = create(
    persist(
        (set) => ({
            animetitle: 'english',
            setAnimeTitle: (animetitle) => set({ animetitle }),
        }),
        {
            name: "selectedLanguage",
        }
    )
);

export const useSubtype = create(
    persist(
        (set) => ({
            subtype: 'sub',
            setSubType: (subtype) => set({ subtype }),
        }),
        {
            name: "selectedType",
        }
    )
);

export const useSearchbar = create(
    (set) => ({
        Isopen: false,
        setSubType: (Isopen) => set({ Isopen }),
    }),
);

export const useNowPlaying = create(
    (set) => ({
        nowPlaying: {},
        setNowPlaying: (nowPlaying) => set({ nowPlaying }),
    }),
);

export const useDataInfo = create(
    (set) => ({
        dataInfo: {},
        setDataInfo: (dataInfo) => set({ dataInfo }),
    }),
);