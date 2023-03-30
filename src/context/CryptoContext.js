import { createContext, useLayoutEffect, useState } from 'react';

// Create context object - wrap the components that need access to the context in the provider
export const CryptoContext = createContext({});

// Create a provider for components to consume and subscribe to changes
export const CryptoProvider = ({ children }) => {
  const [cryptoData, setCryptoData] = useState('this is test state');

  const getCryptoData = async () => {
    try {
      const data =
        await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&locale=en
      `).then(((res) => res.json()).then((json) => json));

      console.log(data);
      setCryptoData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useLayoutEffect(() => {
    getCryptoData();
  }, []);

  return (
    <CryptoContext.Provider value={{ cryptoData }}>
      {children}
    </CryptoContext.Provider>
  );
};
