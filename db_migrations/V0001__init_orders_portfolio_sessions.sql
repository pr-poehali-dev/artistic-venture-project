
CREATE TABLE t_p9191912_artistic_venture_pro.orders (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new',
    worker TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE t_p9191912_artistic_venture_pro.portfolio (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE t_p9191912_artistic_venture_pro.admin_sessions (
    id SERIAL PRIMARY KEY,
    token TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO t_p9191912_artistic_venture_pro.portfolio (title, description, image_url) VALUES
('Проект Alpha', 'Выполнен в срок, клиент доволен', NULL),
('Проект Beta', 'Сложный заказ, реализован за 3 дня', NULL),
('Проект Gamma', 'Командная работа — 5 исполнителей', NULL),
('Проект Delta', 'Повторный заказ от постоянного клиента', NULL),
('Проект Epsilon', 'Срочный заказ, выполнен за 24 часа', NULL),
('Проект Zeta', 'Большой проект, разбит на этапы', NULL);
