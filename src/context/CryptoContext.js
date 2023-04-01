import { createContext, useLayoutEffect, useState } from 'react';

// Create context object - wrap the components that need access to the context in the provider
export const CryptoContext = createContext({});

// Create a provider for components to consume and subscribe to changes
export const CryptoProvider = ({ children }) => {
  const [cryptoData, setCryptoData] = useState();
  const [searchData, setSearchData] = useState();
  const [coinSearch, setCoinSearch] = useState('');

  const [currency, setCurrency] = useState('USD');
  const [sortBy, setSortBy] = useState('market_cap_desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(250);
  const [perPage, setPerPage] = useState(10);

  const getCoinData = async () => {
    try {
      const data = await fetch(`https://api.coingecko.com/api/v3/coins/list`)
        .then((res) => res.json())
        .then((json) => json);

      // console.log(data);
      setTotalPages(data.length);
    } catch (error) {
      console.log(error);
    }

    try {
      const data = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=${sortBy}&per_page=${perPage}&ids=${coinSearch}&page=${page}&sparkline=false&price_change_percentage=1h%2C24h%2C7d&locale=en`
      )
        .then((res) => res.json())
        .then((json) => json);

      console.log(data);
      setCryptoData(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getCryptoData = async () => {
    try {
      const data = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d&locale=en`
      )
        .then((res) => res.json())
        .then((json) => json);

      console.log(data);
      setCryptoData(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getSearchResult = async (query) => {
    try {
      const data = await fetch(
        `https://api.coingecko.com/api/v3/search?query=${query}`
      )
        .then((res) => res.json())
        .then((json) => json);

      console.log(data);
      setSearchData(data.coins);
    } catch (error) {
      console.log(error);
    }
  };

  const resetFunction = () => {
    setPage(1);
    setCoinSearch('');
  };

  useLayoutEffect(() => {
    getCryptoData();
  }, [coinSearch, currency, sortBy, page, perPage]);

  return (
    <CryptoContext.Provider
      value={{
        cryptoData,
        searchData,
        getSearchResult,
        setCoinSearch,
        setSearchData,
        currency,
        setCurrency,
        sortBy,
        setSortBy,
        page,
        setPage,
        totalPages,
        resetFunction,
        setPerPage,
        perPage,
      }}
    >
      {children}
    </CryptoContext.Provider>
  );
};
