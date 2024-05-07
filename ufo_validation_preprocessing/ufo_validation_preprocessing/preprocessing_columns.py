import pandas as pd
import math


def haversine(lat1, lon1, lat2, lon2):
    """
    calculating the distance of two coordinates and the result beeing km
    """

    # Radius of the Earth in kilometers
    R = 6371.0
    
    # Convert latitude and longitude from degrees to radians
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
    
    # Change in coordinates
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    
    # Haversine formula
    a = math.sin(dlat / 2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    # Distance in kilometers
    distance = R * c
    return distance


# creating a date column to work with
def filter_for_date(x):
    return x[0:-6]


def main():
    df = pd.read_csv('data/clean_ufo_data.csv')
    df['sighting_date'] = df['datetime'].apply(filter_for_date)

    df.to_csv('ufo_data_extended.csv', index=False)

if __name__ == '__main__':
    main()



