import pandas as pd

# lat and long of airports in the usa
df = pd.read_csv("../data/airports_usa.csv")

# getting the top 10 airports 
# df = pd.read_csv("../data/top_airports_ww.csv")
# df['Passengers'] = df['Passengers'].str.replace(',', '')

top_airports = ['ATL', 'LAX', 'ORD', 'DFW', 'DEN', 'JFK', 'SFO', 'LAS', 'SEA', 'CLT']

filtered_df = df[df['IATA'].isin(top_airports)]

print(filtered_df)

filtered_df.to_csv("../data/top_10_airports_usa.csv", sep=',')