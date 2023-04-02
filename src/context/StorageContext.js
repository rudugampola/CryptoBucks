import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { CryptoContext } from './../context/CryptoContext';

// Create context object - wrap the components that need access to the context in the provider
export const StorageContext = createContext({});

// Create a provider for components to consume and subscribe to changes
export const StorageProvider = ({ children }) => {
  const [allCoins, setAllCoins] = useState([]);
  const [savedData, setSavedData] = useState();

  let { currency, sortBy } = useContext(CryptoContext);

  const saveCoin = (coinId) => {
    let oldCoins = JSON.parse(localStorage.getItem('coins'));
    if (oldCoins.includes(coinId)) {
      return null;
    } else {
      let newCoin = [...oldCoins, coinId];
      setAllCoins(newCoin);
      localStorage.setItem('coins', JSON.stringify(newCoin));
    }
  };

  const removeCoin = (coinId) => {
    let oldCoins = JSON.parse(localStorage.getItem('coins'));
    let newCoin = oldCoins.filter((coin) => coin !== coinId);
    setAllCoins(newCoin);
    localStorage.setItem('coins', JSON.stringify(newCoin));
  };

  const getSavedData = async (totalCoins = allCoins) => {
    try {
      const data = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency.toLowerCase()}&order=${sortBy}&ids=${totalCoins.join(
          ','
        )}&sparkline=false&price_change_percentage=1h%2C24h%2C7d&locale=en`
      )
        .then((res) => res.json())
        .then((json) => json);

      console.log(data);
      setSavedData(data);
    } catch (error) {
      console.log(error);
    }
  };

  const resetSavedResult = () => {
    getSavedData();
  };

  useEffect(() => {
    if (allCoins.length > 0) {
      getSavedData(allCoins);
    } else {
      setSavedData();
    }
  }, [allCoins]);

  useLayoutEffect(() => {
    let isThere = JSON.parse(localStorage.getItem('coins')) || false;
    if (!isThere) {
      // Create an empty array inside localstorage if there is no array
      localStorage.setItem('coins', JSON.stringify([]));
    } else {
      // If there is an array, set the state to the array
      let totalCoins = JSON.parse(localStorage.getItem('coins'));
      setAllCoins(totalCoins);

      if (totalCoins.length > 0) {
        getSavedData(totalCoins);
      }
    }
  }, []);

  return (
    <StorageContext.Provider
      value={{ saveCoin, allCoins, removeCoin, savedData, resetSavedResult }}
    >
      {children}
    </StorageContext.Provider>
  );
};
