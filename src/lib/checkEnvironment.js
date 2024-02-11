export const checkEnvironment = () => {
    let base_url =
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        // ? 'https://aniplaynow.live'
        : "https://aniplaynow.live";
  
    return base_url;
  };