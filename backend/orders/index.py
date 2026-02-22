"""
Управление заявками: создание новой заявки (POST) и получение списка (GET, только для админа).
"""
import json
import os
import psycopg2

SCHEMA = os.environ['MAIN_DB_SCHEMA']

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
}


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def is_admin(event):
    token = event.get('headers', {}).get('x-admin-token', '')
    if not token:
        return False
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(f"SELECT id FROM {SCHEMA}.admin_sessions WHERE token = '{token}'")
    row = cur.fetchone()
    conn.close()
    return row is not None


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    method = event.get('httpMethod', 'GET')

    if method == 'POST':
        body = json.loads(event.get('body') or '{}')
        name = body.get('name', '').strip()
        phone = body.get('phone', '').strip()
        description = body.get('description', '').strip()

        if not name or not phone or not description:
            return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Заполните все поля'})}

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"INSERT INTO {SCHEMA}.orders (name, phone, description) VALUES ('{name}', '{phone}', '{description}') RETURNING id"
        )
        order_id = cur.fetchone()[0]
        conn.commit()
        conn.close()
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True, 'id': order_id})}

    if method == 'GET':
        if not is_admin(event):
            return {'statusCode': 403, 'headers': CORS, 'body': json.dumps({'error': 'Нет доступа'})}

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"SELECT id, name, phone, description, status, worker, created_at FROM {SCHEMA}.orders ORDER BY created_at DESC"
        )
        rows = cur.fetchall()
        conn.close()
        orders = [
            {'id': r[0], 'name': r[1], 'phone': r[2], 'description': r[3],
             'status': r[4], 'worker': r[5], 'created_at': str(r[6])}
            for r in rows
        ]
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'orders': orders})}

    return {'statusCode': 405, 'headers': CORS, 'body': json.dumps({'error': 'Method not allowed'})}
