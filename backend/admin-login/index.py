"""
Вход в личный кабинет по паролю. Возвращает токен сессии.
"""
import json
import os
import secrets
import psycopg2

SCHEMA = os.environ['MAIN_DB_SCHEMA']
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'admin123')

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    password = body.get('password', '')

    if password != ADMIN_PASSWORD:
        return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Неверный пароль'})}

    token = secrets.token_hex(32)
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(f"INSERT INTO {SCHEMA}.admin_sessions (token) VALUES ('{token}')")
    conn.commit()
    conn.close()

    return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'token': token})}
