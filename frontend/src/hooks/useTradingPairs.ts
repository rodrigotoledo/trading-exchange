import { useState, useEffect } from 'react';
import { generateFakeTradingPairs, updateFakeTradingPairsValues } from '../services/faker.service';
import type { TradingPair } from '../types';

export const useTradingPairs = (count: number = 9) => {
  const [pairs, setPairs] = useState<TradingPair[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPairs(generateFakeTradingPairs(count));
    setLoading(false);

    const interval = setInterval(() => {
      setPairs((currentPairs) => updateFakeTradingPairsValues(currentPairs));
    }, 1000);

    return () => clearInterval(interval);
  }, [count]);

  return { pairs, loading };
};
