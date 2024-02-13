"use client";
import React, { useState } from "react";
import styles from "../../styles/AnimeDetailsBottom.module.css";
import Animecards from "../CardComponent/Animecards";
import { AnimatePresence, motion } from "framer-motion";
import Characters from "./Characters";
import Overview from "./tabs/Overview";

function AnimeDetailsBottom({ data }) {
  const tabs = [
    {
      name: "Overview",
      label: "Overview",
    },
    {
      name: "Relations",
      label: "Relations",
    },
    {
      name: "Characters",
      label: "Characters",
    },
    {
      name: "Staff",
      label: "Staff",
    },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0]);

  const handleClick = (e, tab) => {
    e.preventDefault();

    setActiveTab(tab);
  };

  const isSelected = (tab) => activeTab.name === tab.name;

  return (
    <div>
      <div className={styles.detailstabs}>
        <div className={styles.tabHeader}>
          {tabs.map((tab) => (
            <div
              key={tab.name}
              className={[
                styles.tabItem,
                isSelected(tab) ? styles.selected : "",
              ].join(" ")}
            >
              <div key={tab.name} onClick={(e) => handleClick(e, tab)}>
                {tab.label}
              </div>
              {isSelected(tab) && (
                <motion.div layoutId="indicator" className={styles.indicator} />
              )}
            </div>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab.name || "empty"}
            initial="initial"
            animate="enter"
            exit="exit"
            transition={{
              duration: 0.3,
            }}
          >
            {activeTab && activeTab.name === "Overview" && <Overview data={data} />}
            {activeTab.name === "Relations" && (
              <div className={styles.relations}>
                <h3 className={styles.relationsheading}>Chronology</h3>
                <Animecards
                  data={data?.relations?.edges}
                  cardid="Related Anime"
                  show={false}
                />
              </div>
            )}
            {activeTab.name === "Characters" && (
              <div className={styles.characters}>
                <h3 className={styles.relationsheading}>Anime Characters</h3>
                <Characters data={data?.characters?.edges} />
              </div>
            )}
            {activeTab.name === "Staff" && (
              <div className={styles.detailscard}>Coming Soon</div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default AnimeDetailsBottom;
