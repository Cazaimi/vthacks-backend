import os

from flask import Flask, request, send_file, jsonify
import psycopg2
import csv
from flask_cors import CORS
import get_prompt

appFlask = Flask(__name__)
CORS(appFlask)

@appFlask.route('/query')
def access_param():
    emission_factor = request.args.get('emission_factor')
    sector = request.args.get('sector')
    category = request.args.get('category')
    name = request.args.get('name')

    query = ""
    if emission_factor != "0" and sector != "0" and category != "0" and name != "0":
        query = '''select year, SUM(factor) from public.emission_data where constituent_gases like '%{}%' and sector = '{}' and category='{}' and 
        name like '%{}%' group by year'''.format(emission_factor, sector, category, name)
    elif name == "0":
        query = '''select year, SUM(factor) from public.emission_data where constituent_gases like '%{}%' and sector = '{}' and category='{}' 
        group by year'''.format(emission_factor, sector, category)
        if category == "0":
            query = '''select year, SUM(factor) from public.emission_data where constituent_gases like '%{}%' and sector = '{}' group by 
            year'''.format(emission_factor, sector)
            if sector == "0":
                query = '''select year, SUM(factor) from public.emission_data where constituent_gases like '%{}%' order by year'''.format(
                    emission_factor)

    conn = psycopg2.connect(
        host="database-1.cn8qrfvgbefy.us-east-1.rds.amazonaws.com",
        dbname="emission_data",
        user="postgres",
        password="postgres")
    cur = conn.cursor()
    print(query)
    cur.execute(query)
    records = cur.fetchall()

    print(records)
    print(type(records))
    for record in records:
        print(type(record))
    #
    # with open('file.csv', 'w', newline='') as f:
    #     writer = csv.writer(f)
    #     writer.writerows(records)
    #
    # csv_dir = "./"
    # csv_file = "file.csv"
    # csv_path = os.path.join(csv_dir, csv_file)

    return records

@appFlask.route('/options')

def get_actions():
    query = '''select * from classification '''

    conn = psycopg2.connect(
        host="database-1.cn8qrfvgbefy.us-east-1.rds.amazonaws.com",
        dbname="emission_data",
        user="postgres",
        password="postgres")
    cur = conn.cursor()
    print(query)
    cur.execute(query)
    records = cur.fetchall()
    print(records)

    return jsonify(records)

@appFlask.route('/ask', methods = ['POST'])
def ask():
    body = request.get_json()
    message = body.get('message')

    if message == None:
        return

    prompt_answer = get_prompt.send(message)
    intent = prompt_answer.get('intent')
    actions = False

    print(intent.keys(), intent.get('tag'))
    if intent.get('tag') == 'capability':
        actions = True

    answer = { "answer": prompt_answer.get('answer'), "actions": actions }

    return jsonify(answer)

@appFlask.route('/Sectors')
def get_sectors():
    query = "select DISTINCT sector from public.emission_data"
    conn = psycopg2.connect(
        host="database-1.cn8qrfvgbefy.us-east-1.rds.amazonaws.com",
        dbname="emission_data",
        user="postgres",
        password="postgres")
    cur = conn.cursor()
    print(query)
    cur.execute(query)
    records = cur.fetchall()

    return records


@appFlask.route('/Categories')
def get_categories():
    sector = request.args.get('sector')

    query = "select DISTINCT category from public.emission_data where sector='{}'".format(sector)
    conn = psycopg2.connect(
        host="database-1.cn8qrfvgbefy.us-east-1.rds.amazonaws.com",
        dbname="emission_data",
        user="postgres",
        password="postgres")
    cur = conn.cursor()
    print(query)
    cur.execute(query)
    records = cur.fetchall()

    return records


@appFlask.route('/Items')
def get_items():
    sector = request.args.get('sector')
    category = request.args.get('category')

    query = "select DISTINCT name from public.emission_data where sector='{}' and category='{}'".format(sector,
                                                                                                        category)
    conn = psycopg2.connect(
        host="database-1.cn8qrfvgbefy.us-east-1.rds.amazonaws.com",
        dbname="emission_data",
        user="postgres",
        password="postgres")
    cur = conn.cursor()
    print(query)
    cur.execute(query)
    records = cur.fetchall()

    return records

# close the communication with the PostgreSQL
# cur.close()

appFlask.run(debug=True, port=5000)
