import json
from random import sample

from flask import Flask

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
