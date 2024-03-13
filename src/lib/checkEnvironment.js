export const checkEnvironment = () => {
    let base_url =
      process.env.NODE_ENV === "development"
        ? process.env.NEXT_PUBLIC_DEV_URL
        : process.env.NEXT_PUBLIC_PRODUCTION_URL
        ;

    if (!base_url) base_url = window.location.origin;
    return base_url;
  };
