import { useEffect, useState } from 'react';
import { adminLogin, getOrders, updateOrder } from '@/api';

type Order = {
  id: number;
  name: string;
  phone: string;
  description: string;
  status: string;
  worker: string | null;
  created_at: string;
};

const STATUS_LABELS: Record<string, string> = {
  new: 'Новая',
  in_progress: 'В работе',
  done: 'Выполнена',
};

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  in_progress: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  done: 'bg-green-500/20 text-green-300 border-green-500/30',
};

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem('admin_token') || '');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editWorker, setEditWorker] = useState('');
  const [editStatus, setEditStatus] = useState('');

  const isLoggedIn = !!token;

  useEffect(() => {
    if (isLoggedIn) loadOrders();
  }, [isLoggedIn]);

  async function loadOrders() {
    setLoading(true);
    const data = await getOrders(token);
    if (data.orders) setOrders(data.orders);
    setLoading(false);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError('');
    const data = await adminLogin(password);
    if (data.token) {
      localStorage.setItem('admin_token', data.token);
      setToken(data.token);
    } else {
      setLoginError('Неверный пароль');
    }
  }

  function logout() {
    localStorage.removeItem('admin_token');
    setToken('');
    setOrders([]);
  }

  function startEdit(order: Order) {
    setEditId(order.id);
    setEditWorker(order.worker || '');
    setEditStatus(order.status);
  }

  async function saveEdit(id: number) {
    await updateOrder(token, { id, status: editStatus, worker: editWorker });
    setEditId(null);
    loadOrders();
  }

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
        <div className="w-full max-w-sm">
          <h1 className="mb-8 text-2xl font-light text-white">Вход в кабинет</h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-b border-white/20 bg-transparent py-3 text-white placeholder-white/30 outline-none focus:border-white"
            />
            {loginError && <p className="text-sm text-red-400">{loginError}</p>}
            <button
              type="submit"
              className="bg-white px-6 py-3 text-sm font-semibold uppercase tracking-widest text-black hover:bg-white/90"
            >
              Войти
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 flex items-center justify-between">
          <h1 className="text-2xl font-light text-white">Личный кабинет</h1>
          <button onClick={logout} className="text-sm text-white/40 hover:text-white">
            Выйти
          </button>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
            Заявки ({orders.length})
          </p>
          <button onClick={loadOrders} className="text-xs text-white/40 hover:text-white">
            Обновить
          </button>
        </div>

        {loading ? (
          <p className="text-white/40">Загрузка...</p>
        ) : orders.length === 0 ? (
          <p className="text-white/40">Заявок пока нет</p>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-none border border-white/10 bg-white/5 p-6"
              >
                <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-medium text-white">{order.name}</p>
                    <p className="text-sm text-white/50">{order.phone}</p>
                    <p className="mt-2 text-sm text-white/70">{order.description}</p>
                  </div>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-medium ${STATUS_COLORS[order.status] || 'bg-white/10 text-white/60 border-white/20'}`}
                  >
                    {STATUS_LABELS[order.status] || order.status}
                  </span>
                </div>

                {editId === order.id ? (
                  <div className="flex flex-wrap gap-3">
                    <input
                      type="text"
                      value={editWorker}
                      onChange={(e) => setEditWorker(e.target.value)}
                      placeholder="Исполнитель"
                      className="flex-1 border-b border-white/30 bg-transparent py-1.5 text-sm text-white placeholder-white/30 outline-none focus:border-white"
                    />
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="bg-neutral-900 px-3 py-1.5 text-sm text-white outline-none"
                    >
                      <option value="new">Новая</option>
                      <option value="in_progress">В работе</option>
                      <option value="done">Выполнена</option>
                    </select>
                    <button
                      onClick={() => saveEdit(order.id)}
                      className="bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-black hover:bg-white/90"
                    >
                      Сохранить
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="px-4 py-1.5 text-xs text-white/40 hover:text-white"
                    >
                      Отмена
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-white/30">
                      {order.worker ? `Исполнитель: ${order.worker}` : 'Исполнитель не назначен'}
                      {' · '}
                      {new Date(order.created_at).toLocaleDateString('ru-RU')}
                    </p>
                    <button
                      onClick={() => startEdit(order)}
                      className="text-xs text-white/40 underline hover:text-white"
                    >
                      Изменить
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
