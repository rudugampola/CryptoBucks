import { createContext, useLayoutEffect, useState } from 'react';

// Create context object - wrap the components that need access to the context in the provider
export const TrendingContext = createContext({});

// Create a provider for components to consume and subscribe to changes
export const TrendingProvider = ({ children }) => {
  const [trendData, setTrendData] = useState();

  const getTrendData = async () => {
    try {
      const data = await fetch(
        `https://api.coingecko.com/api/v3/search/trending`
      )
        .then((res) => res.json())
        .then((json) => json);

      console.log(data);
      setTrendData(data.coins);
    } catch (error) {
      console.log(error);
    }
  };

  const resetTrendingResult = () => {
    getTrendData();
  };

  useLayoutEffect(() => {
    getTrendData();
  }, []);

  return (
    <TrendingContext.Provider value={{ trendData, resetTrendingResult }}>
      {children}
    </TrendingContext.Provider>
  );
};
