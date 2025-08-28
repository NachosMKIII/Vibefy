This is an application that uses the Spotify API

To access the playback feature(play a song) is necessary to log in with a spotify premium account.

For the app to function properly you need to a client ID and a callback route, create a Spotify App and replace the variables found in the
route.js files inside
/api/get-token
/api/logout
/api/refresh
/api/token

The variables that should be replaced with your own are
process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
and
process.env.NEXT_PUBLIC_REDIRECT_URI
