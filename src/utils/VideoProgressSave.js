"use client"
import { useState } from "react";

function VideoProgressSave() {

    const [settings, setSettings] = useState(() => {
    const storedSettings = localStorage?.getItem("vidstack_settings");
    return storedSettings ? JSON.parse(storedSettings) : {};
  });

  const getVideoProgress = (id)=> {
    return settings[id];
  };

  const UpdateVideoProgress = (id, data) => {
    const updatedSettings = { ...settings, [id]: data };
    setSettings(updatedSettings);

    localStorage.setItem("vidstack_settings", JSON.stringify(updatedSettings));
  };

  return [getVideoProgress, UpdateVideoProgress];
}

export default VideoProgressSave;