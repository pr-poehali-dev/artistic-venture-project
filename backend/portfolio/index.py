"""
Получение списка работ из портфолио.
"""
import json
import os
import psycopg2

SCHEMA = os.environ['MAIN_DB_SCHEMA']

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    conn = get_conn()
    cur = conn.cursor()
    cur.execute(f"SELECT id, title, description, image_url, created_at FROM {SCHEMA}.portfolio ORDER BY created_at DESC")
    rows = cur.fetchall()
    conn.close()

    items = [
        {'id': r[0], 'title': r[1], 'description': r[2], 'image_url': r[3], 'created_at': str(r[4])}
        for r in rows
    ]
    return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'items': items})}
