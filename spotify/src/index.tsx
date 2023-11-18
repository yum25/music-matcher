import { Hono } from "hono";
import { env } from "hono/adapter";
import { getCookie, setCookie } from "hono/cookie";

import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";

import "dotenv/config";

const SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize";
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_API_URL = "https://api.spotify.com/v1/";
const SPOTIFY_REDIRECT_URI = "http://localhost:3000/callback";

const app = new Hono();

async function getTracks(ids: string[], session: string) {
  const endpoint = new URL("audio-features", SPOTIFY_API_URL);
  endpoint.searchParams.set("ids", ids.join(","));

  const response = await fetch(endpoint, {
    headers: new Headers({
      Authorization: `Bearer ${session}`,
    }),
  });

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }

  return await response.json();
}

async function getPlaylist(
  id: string,
  attributes: { genre: string; small: boolean },
  session: string
) {
  const endpoint = new URL(`playlists/${id}/`, SPOTIFY_API_URL);

  const response = await fetch(endpoint, {
    headers: new Headers({
      Authorization: `Bearer ${session}`,
    }),
  });

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }

  const data = await response.json();

  const tracks = await getTracks(
    data.tracks.items.map(({ track }) => track.id),
    session
  );

  return data.tracks.items.map(({ track }, i: number) => ({
    id: track.id,
    name: track.name,
    artists: track.artists,
    album: {
      images: track?.album?.images,
      title: track?.album?.name,
    },
    attributes: { ...tracks.audio_features[i], ...attributes },
  }));
}

app.get("/", async (c) => {
  const session = getCookie(c, "session");

  if (!session) {
    return c.redirect("/auth", 302);
  }

  return c.text(
    JSON.stringify(
      [
        ...(await getPlaylist(
          "37i9dQZF1DWTwnEm1IYyoj",
          { genre: "Soft Pop", small: false },
          session
        )),
        ...(await getPlaylist(
          "37i9dQZF1DWXRqgorJj26U",
          { genre: "Rock", small: false },
          session
        )),
        ...(await getPlaylist(
          "37i9dQZF1DWYV7OOaGhoH0",
          { genre: "Folk", small: false },
          session
        )),
        ...(await getPlaylist(
          "2R6CUqQRRhG3ork8oOanMT",
          { genre: "Soft Pop", small: true },
          session
        )),
        ...(await getPlaylist(
          "0Bl6JlHwHcLzsNhCoTAhqN",
          { genre: "Rock", small: true },
          session
        )),
        ...(await getPlaylist(
          "37i9dQZF1E4vO9vQrP1bfz",
          { genre: "Folk", small: true },
          session
        )),
      ],
      null,
      2
    )
  );
});

app.get("/auth", (c) => {
  const { SPOTIFY_CLIENT_ID } = env<{
    SPOTIFY_CLIENT_ID: string;
  }>(c, "node");

  const params = new URLSearchParams();
  params.set("client_id", SPOTIFY_CLIENT_ID);
  params.set("response_type", "code");
  params.set("redirect_uri", SPOTIFY_REDIRECT_URI);
  params.set("scope", "");

  return c.html(
    <html lang="en">
      <head>
        <title>music-matcher</title>
        <link rel="stylesheet" href="/auth.css" />
      </head>
      <body>
        <div>
          <a href={`${SPOTIFY_AUTH_URL}/?${params.toString()}`}>
            Sign in with Spotify.
          </a>
        </div>
      </body>
    </html>
  );
});

app.get("/callback", async (c) => {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = env<{
    SPOTIFY_CLIENT_ID: string;
    SPOTIFY_CLIENT_SECRET: string;
  }>(c, "node");

  const code = c.req.query("code");

  const headers = new Headers({
    "Content-Type": "application/x-www-form-urlencoded",
  });

  const body = new URLSearchParams();
  body.set("grant_type", "authorization_code");
  body.set("code", code);
  body.set("redirect_uri", SPOTIFY_REDIRECT_URI);
  body.set("client_id", SPOTIFY_CLIENT_ID);
  body.set("client_secret", SPOTIFY_CLIENT_SECRET);

  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers,
    body,
  });

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }

  const data = await response.json();

  setCookie(c, "session", data.access_token, {
    secure: true,
    httpOnly: true,
  });
  return c.redirect("/", 302);
});

app.use("/*", serveStatic({ root: "./public" }));

serve(app);
