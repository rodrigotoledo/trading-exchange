import { useUsers, useTradingPairs } from '../../hooks';
import FakeUsers from '../../components/shared/FakeUsers';

const Dashboard = () => {
  const { users, loading: usersLoading } = useUsers(10);
  const { pairs, loading: pairsLoading } = useTradingPairs(9);

  if (usersLoading || pairsLoading) {
    return <div className="text-center py-8">Carregando dados...</div>;
  }

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-3xl font-bold text-primary mb-6">Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {pairs.map((pair) => (
            <div
              key={pair.id}
              className="bg-surface-tertiary border border-default rounded-lg p-6 hover:bg-surface-secondary hover:border-accent transition-all"
            >
              <h3 className="text-lg font-semibold text-primary mb-4">{pair.symbol}</h3>
              <div className="space-y-2">
                <p className="text-sm text-secondary">Price</p>
                <p className="text-xl font-mono text-accent">${pair.price.toFixed(2)}</p>
              </div>
              <div className="space-y-2 mt-4">
                <p className="text-sm text-secondary">Volume</p>
                <p className="text-xl font-mono text-accent">{pair.volume} BTC</p>
              </div>
              <div className="space-y-2 mt-4">
                <p className="text-sm text-secondary">24h Change</p>
                <p className={`text-lg font-mono ${pair.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {pair.change24h >= 0 ? '+' : ''}{pair.change24h.toFixed(2)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-2xl font-bold text-primary mb-4">Usuários</h3>
        <FakeUsers users={users} />
      </section>
    </div>
  );
};

export default Dashboard;
