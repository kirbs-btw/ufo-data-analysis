import pandas as pd

df = pd.read_csv("data/ufo_data.csv") # 80332 data points

# filtering for only usa
df = df[df['country'] == 'us'] # 65114 data points 

df = df.dropna(subset=['latitude']) # 65114
df = df.dropna(subset=['longitude'])# 65114

# converting lat and long
df['latitude'] = df['latitude'].astype(float)
df['longitude'] = df['longitude'].astype(float)

# reset index after dropping rows
df = df.reset_index(drop=True)

# adding year as a column
year_arr = []
for i in df['datetime']:
    year = i[-10:-6]
    year_arr.append(year)
    
year_se = pd.Series(year_arr)
df['year'] = year_se

df.to_csv("data/clean_ufo_data.csv", sep=',')