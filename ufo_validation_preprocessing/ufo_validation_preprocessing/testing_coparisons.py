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

def day_diff(data_a_index, data_b_index, df):
    """returns dist of the points"""
    diff = (df.loc[data_a_index, 'sighting_date'] - df.loc[data_b_index, 'sighting_date']).days
    return abs(diff)




def check_for_similar(df):
    # hardcoding it for multiple values
    # 1 day 3 day 7 days 14 days
    # 3 km 10 km 25 km 50 km 

    day_dist = 7 # 5 day apart
    km_dist = 10

    for index, row in df.iterrows():
        found_cluster = False
        sighting_cluster = []
        current_shape = row['shape']
        if current_shape == "other" or current_shape == "unknown":
            continue
        
        for innerIndex, innerRow in df[df['shape']==current_shape].iloc[index+1:].iterrows():
            # checking for the day diff
            current_day_dist = day_diff(index, innerIndex, df)
            if current_day_dist > day_dist:
                continue

            
            # checking for the km dist
            current_km_dist = haversine(row['latitude'], row['longitude'], innerRow['latitude'], innerRow['longitude'])
            if current_km_dist > km_dist:
                continue
            found_cluster = True
            sighting_cluster.append(innerRow)
        
        if not found_cluster:
            continue

        # filling the cluster
        sighting_cluster.append(row)



def main():
    df = pd.read_csv('ufo_validation_preprocessing/ufo_data_extended.csv')

    df['sighting_date'] = pd.to_datetime(df['sighting_date'], format='%m/%d/%Y')    

    check_for_similar(df)

    
if __name__ == '__main__':
    main()