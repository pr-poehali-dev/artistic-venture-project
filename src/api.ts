const URLS = {
  orders: 'https://functions.poehali.dev/9258906b-abb7-4e4b-95be-583d1a97d2f8',
  ordersUpdate: 'https://functions.poehali.dev/6fa0ff69-3c6d-4342-b87d-52b3135f695b',
  portfolio: 'https://functions.poehali.dev/2992a3a0-1f62-42a7-bd67-2620d4720879',
  adminLogin: 'https://functions.poehali.dev/b92da7e3-45fe-453e-b2db-efed81f5840f',
};

export async function submitOrder(data: { name: string; phone: string; description: string }) {
  const res = await fetch(URLS.orders, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getOrders(token: string) {
  const res = await fetch(URLS.orders, {
    method: 'GET',
    headers: { 'x-admin-token': token },
  });
  return res.json();
}

export async function updateOrder(token: string, data: { id: number; status: string; worker: string }) {
  const res = await fetch(URLS.ordersUpdate, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getPortfolio() {
  const res = await fetch(URLS.portfolio);
  return res.json();
}

export async function adminLogin(password: string) {
  const res = await fetch(URLS.adminLogin, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  return res.json();
}
