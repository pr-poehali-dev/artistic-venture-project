"""
Обновление статуса заявки и назначение исполнителя (только для админа).
"""
import json
import os
import psycopg2

SCHEMA = os.environ['MAIN_DB_SCHEMA']

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

    if not is_admin(event):
        return {'statusCode': 403, 'headers': CORS, 'body': json.dumps({'error': 'Нет доступа'})}

    body = json.loads(event.get('body') or '{}')
    order_id = int(body.get('id', 0))
    status = body.get('status', '').strip()
    worker = body.get('worker', '').strip()

    if not order_id:
        return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Не указан id'})}

    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        f"UPDATE {SCHEMA}.orders SET status = '{status}', worker = '{worker}' WHERE id = {order_id}"
    )
    conn.commit()
    conn.close()
    return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True})}
