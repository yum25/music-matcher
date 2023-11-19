import json
from random import sample

from flask import Flask, request
import pandas as pd
import numpy as np

app = Flask(__name__)

with open("./playlist.json", "r", encoding="utf-8") as f:
    songs = json.loads(f.read())

    soft_pop_songs = list(
        filter(lambda song: song["attributes"]["genre"] == "Soft Pop", songs)
    )
    rock_songs = list(filter(lambda song: song["attributes"]["genre"] == "Rock", songs))
    folk_songs = list(filter(lambda song: song["attributes"]["genre"] == "Folk", songs))


@app.route("/")
def root_route():
    soft_pop_indices = sample(range(0, len(soft_pop_songs)), 3)
    rock_indices = sample(range(0, len(rock_songs)), 3)
    folk_indices = sample(range(0, len(folk_songs)), 3)

    return [
        soft_pop_songs[soft_pop_indices[0]],
        soft_pop_songs[soft_pop_indices[1]],
        soft_pop_songs[soft_pop_indices[2]],
        rock_songs[rock_indices[0]],
        rock_songs[rock_indices[1]],
        rock_songs[rock_indices[2]],
        folk_songs[folk_indices[0]],
        folk_songs[folk_indices[1]],
        folk_songs[folk_indices[2]],
    ]

parsed_songs = pd.read_json('parsed.json').T

@app.route("/recommend", methods=['POST'])
def recommend_route():
    popular_songs = parsed_songs[parsed_songs["small"] == False]
    small_songs = parsed_songs[parsed_songs["small"] == True]

    liked_popular_songs = request.get_json()

    popular_songs['liked'] = popular_songs['id'].isin(liked_popular_songs)
    filtered_popular_songs = popular_songs[popular_songs['liked'] == True]

    rock = 0
    pop = 0
    folk = 0
    for genre in filtered_popular_songs['genre']:
        if 'Rock' in genre:
            rock += 1
        if 'Soft Pop' in genre:
            pop +=1
        if 'Folk' in genre:
            folk += 1

    if (rock / filtered_popular_songs.shape[0]) < 1 / 3:
        small_songs = small_songs[small_songs["genre"] != "Rock"]
    if (pop / filtered_popular_songs.shape[0] < 1 / 3):
        small_songs = small_songs[small_songs["genre"] != "Soft Pop"]
    if (folk / filtered_popular_songs.shape[0] < 1 / 3):
        small_songs = small_songs[small_songs["genre"] != "Folk"]

    popular_matrix = filtered_popular_songs['attributes'].apply(pd.Series)
    popular_matrix = popular_matrix.to_numpy()

    small_matrix = small_songs['attributes'].apply(pd.Series)
    small_matrix = small_matrix.to_numpy()

    similarity = np.matmul(popular_matrix, small_matrix.T)
    small_scores = similarity.mean(axis = 0)
    top_song = np.argmax(small_scores)

    top_song_id = small_songs.iloc[top_song]["id"]
    return list(filter(lambda song: song["id"] == top_song_id, songs)).pop()
