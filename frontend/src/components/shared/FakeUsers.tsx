import type { User } from '../../types';

interface FakeUsersProps {
  users: User[];
}

const FakeUsers = ({ users }: FakeUsersProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface-tertiary border-b border-default">
          <tr>
            <th className="px-4 py-3 font-semibold text-primary">Nome</th>
            <th className="px-4 py-3 font-semibold text-primary">Email</th>
            <th className="px-4 py-3 font-semibold text-primary">Telefone</th>
            <th className="px-4 py-3 font-semibold text-primary">Endereço</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-default hover:bg-surface-tertiary transition-colors">
              <td className="px-4 py-3 text-secondary">{user.name}</td>
              <td className="px-4 py-3 text-secondary">{user.email}</td>
              <td className="px-4 py-3 text-secondary">{user.phone}</td>
              <td className="px-4 py-3 text-secondary">{user.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FakeUsers;
