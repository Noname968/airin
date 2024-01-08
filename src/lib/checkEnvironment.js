export const checkEnvironment = () => {
    let base_url =
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        // ? 'https://ani-next.vercel.app'
        : "https://ani-next.vercel.app";
        // : "https://ani-next-git-beta-luckyhv.vercel.app"
  
    return base_url;
  };