export interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  phone?: string;
}

export interface TradingPair {
  id: string;
  symbol: string;
  price: number;
  volume: number;
  change24h: number;
}

export interface NavLink {
  label: string;
  path: string;
}
