from flask import Flask, render_template, request, jsonify
import pandas as pd
import openpyxl
from openpyxl import Workbook
import itertools
from copy import deepcopy

app = Flask(__name__)

@app.route('/')
def index():
   return render_template('index.html')

@app.route('/handle_data', methods=['POST'])
def handle_data():
    formData = request.form.getlist('city[]')
    #for i in formData:
    #    print(i,type(i))

    '''read hotel data'''
    path = "static/hotel.xlsx"
    wb_obj = openpyxl.load_workbook(path)
    sheet_obj = wb_obj.active
    temp = pd.DataFrame(sheet_obj.values)
    headers = temp.iloc[0]
    hotel  = pd.DataFrame(temp.values[1:], columns=headers)

    '''read flight data'''
    path = "static/flight.xlsx"
    wb_obj = openpyxl.load_workbook(path)
    sheet_obj = wb_obj.active
    temp = pd.DataFrame(sheet_obj.values)
    headers = temp.iloc[0]
    flight  = pd.DataFrame(temp.values[1:], columns=headers)

    '''declare variables'''
    allH={}
    allP={}
    startCity=formData[0]
    startDay=int(formData[1].split("-")[2])
    route={}

    #fill the route with the data form POST request
    for i in range(2,len(formData),2):
        route[ formData[i] ] =  int(formData[i+1])

    '''calculate hotel prices'''
    permutations=itertools.permutations(route)
    for permutation in permutations:

        hotel_cost=0
        day=startDay
        for city in permutation:
            for i in range(route[city]):
                try:
                    row=hotel.loc[hotel['city'] == city].loc[hotel['startDay'] == day].head(1)
                    price= int(row["price"])
                    hotel_cost+=price
                    #print(city,day,price)
                    day+=1
                except Exception as e:
                    print("Hotel Error1: ",e)
        #print(permutation,hotel_cost)
        allH[permutation]=hotel_cost
        #print()

    '''Calculate flight prices'''
    permutations=itertools.permutations(route)
    for permutation in permutations:

        flight_cost=0
        day=startDay
        permutationCopy=deepcopy(permutation)
        #print("*",permutation)
        permutation=list(permutation)
        permutation.insert(0,startCity)
        permutation.append(startCity)
        #print("*",permutation)
        for i in range(0,len(permutation)-1):
            #print("i:::::::::: ",i)
            try:
                if permutation[i]==startCity:
                    day+=0
                else:
                    day+=route[permutation[i]]
                row=flight.loc[flight['Departure'] == permutation[i]].loc[flight['Arrival'] == permutation[i+1]]
                row=row.loc[flight['date']==day].head(1)

                price= int(row["price"])
                flight_cost+=price
                #print(i,"-",permutation[i],permutation[i+1],day,price)

            except Exception as e:
                price= 9999
                flight_cost+=price
                print("Flight Error1: ",e)

        #print(permutation,flight_cost)
        allP[permutationCopy]=flight_cost
        #print("-----")

    '''Sum costs and order'''
    permutations=itertools.permutations(route)
    l=[]
    for permutation in permutations:
        p1=allH[permutation]
        p2=allP[permutation]
        l.append([p1+p2,permutation,p1,p2])
    l.sort(key=lambda x: x[0])
    for i in l:
        print(i)

    def trace(l,i,j):
        result_permutation=l[i][j]
        resultJSON={}
        for cityName in result_permutation:
            resultJSON[cityName] = {"day":0,"hotel_cost":0,"flight_cost":0}
        resultJSON[startCity] = {"day":0,"hotel_cost":0,"flight_cost":0}

        day=startDay
        for city in result_permutation:
            hotel_city_cost=0

            for i in range(route[city]):
                try:
                    row=hotel.loc[hotel['city'] == city].loc[hotel['startDay'] == day].head(1)
                    price= int(row["price"])
                    hotel_city_cost+=price
                    #print(city,day,price)
                    day+=1
                except Exception as e:
                    print(e)

            resultJSON[city]["hotel_cost"] = hotel_city_cost

        result_permutation=list(result_permutation)
        result_permutation.insert(0,startCity)
        result_permutation.append(startCity)

        day=startDay
        for i in range(0,len(result_permutation)-1):
            try:
                if result_permutation[i]==startCity:
                    day+=0
                else:
                    day+=route[result_permutation[i]]

                row=flight.loc[flight['Departure'] == result_permutation[i]].loc[flight['Arrival'] == result_permutation[i+1]]
                print(type(row))
                row=row.loc[flight['date']==day].head(1)
                print(type(row))
                price= int(row["price"])
                resultJSON[result_permutation[i+1]]["day"] = day
                resultJSON[result_permutation[i+1]]["flight_cost"] = price


            except Exception as e:
                    print("Flight Error2: ",e)


        return resultJSON


    toReturn= { "Best":  trace(l,0,1) , "Second":  trace(l,1,1) }
    if len(l)>2:
        toReturn["Third"] =  trace(l,2,1)


    return jsonify(toReturn)



if __name__ == '__main__':
   app.run(debug = True)
