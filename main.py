import os

from flask import Flask, request, send_file
import psycopg2
import csv
import 

appFlask = Flask(__name__)

@appFlask.route('/query')
def access_param():
    emission_factor = request.args.get('ef')
    sector = request.args.get('s')
    category = request.args.get('c')
    activity_id = request.args.get('aid')

    query = ""
    if emission_factor != "0" and sector != "0" and category != "0" and activity_id != "0":
        query = '''select * from public.emission_data where constituent_gases like '%{}%' and sector = '{}' and category='{}' and 
        activity_id like '%{}%' order by year'''.format(
            emission_factor, sector, category, activity_id)
    elif activity_id == "0":
        query = '''select * from public.emission_data where constituent_gases like '%{}%' and sector = '{}' and category='{}' 
        order by year'''.format(
            emission_factor, sector, category)
        if category == "0":
            query = '''select * from public.emission_data where constituent_gases like '%{}%' and sector = '{}' order by 
            year'''.format(
                emission_factor, sector)
            if sector == "0":
                query = '''select * from public.emission_data where constituent_gases like '%{}%' order by year'''.format(
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

    with open('file.csv', 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerows(records)

    csv_dir = "./"
    csv_file = "file.csv"
    csv_path = os.path.join(csv_dir, csv_file)

    return send_file(csv_path)


@appFlask.route('/ask')
def access_param():
    query = request.get_json()
    message = request.get('message')

    if message == None:
        return

    return send_file(csv_path)



# close the communication with the PostgreSQL
# cur.close()

appFlask.run(debug=True, port=5000)
