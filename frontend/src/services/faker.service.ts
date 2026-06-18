import { faker } from '@faker-js/faker';
import type { User, TradingPair } from '../types';

export const generateFakeUsers = (count: number = 10): User[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    address: faker.location.streetAddress(),
    phone: faker.phone.number(),
  }));
};

export const updateFakeUsersValues = (users: User[]): User[] => {
  return users.map((user) => ({
    ...user,
    email: faker.internet.email(),
    phone: faker.phone.number(),
  }));
};

export const generateFakeTradingPairs = (count: number = 9): TradingPair[] => {
  const symbols = ['BTC/USD', 'ETH/USD', 'XRP/USD', 'ADA/USD', 'SOL/USD', 'DOGE/USD', 'LINK/USD', 'MATIC/USD', 'DOT/USD'];

  return Array.from({ length: Math.min(count, symbols.length) }, (_, index) => ({
    id: faker.string.uuid(),
    symbol: symbols[index],
    price: parseFloat(faker.finance.amount({ min: 100, max: 50000, dec: 2 })),
    volume: parseFloat(faker.finance.amount({ min: 100, max: 5000, dec: 0 })),
    change24h: parseFloat(faker.finance.amount({ min: -10, max: 10, dec: 2 })),
  }));
};

export const updateFakeTradingPairsValues = (pairs: TradingPair[]): TradingPair[] => {
  return pairs.map((pair) => ({
    ...pair,
    price: parseFloat(faker.finance.amount({ min: 100, max: 50000, dec: 2 })),
    volume: parseFloat(faker.finance.amount({ min: 100, max: 5000, dec: 0 })),
    change24h: parseFloat(faker.finance.amount({ min: -10, max: 10, dec: 2 })),
  }));
};
