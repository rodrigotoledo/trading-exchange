import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="space-y-8">
      <section className="text-center py-12">
        <h2 className="text-4xl font-bold text-primary mb-4">Bem-vindo ao Exchange Trading Dashboard</h2>
        <p className="text-lg text-secondary mb-8">
          Gerencie e acompanhe seus pares de trading em tempo real
        </p>
        <Link
          to="/dashboard"
          className="inline-block bg-accent hover:bg-accent-hover text-white px-8 py-3 rounded-md font-medium transition-colors shadow-accent"
        >
          Acessar Dashboard
        </Link>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-tertiary border border-default rounded-lg p-6">
          <h3 className="text-lg font-semibold text-primary mb-3">Dados em Tempo Real</h3>
          <p className="text-secondary">Acompanhe os preços e volumes dos principais pares de trading</p>
        </div>
        <div className="bg-surface-tertiary border border-default rounded-lg p-6">
          <h3 className="text-lg font-semibold text-primary mb-3">Análise Detalhada</h3>
          <p className="text-secondary">Visualize gráficos e tendências de mercado para tomar melhores decisões</p>
        </div>
        <div className="bg-surface-tertiary border border-default rounded-lg p-6">
          <h3 className="text-lg font-semibold text-primary mb-3">Gerenciamento de Usuários</h3>
          <p className="text-secondary">Gerencie múltiplas contas e perfis de negociação</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
