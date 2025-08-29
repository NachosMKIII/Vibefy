This is an application that uses the Spotify API and playback SDK

To really experience the app you need an Spotify premium account or you will hit an error when trying to access a lot of the features.

To run the app properly you need to a client ID and a callback route, create a Spotify App and
replace the variables found in the route.js files inside
/api/get-token
/api/refresh
/api/token

The variables that should be replaced with your own are
process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
and
process.env.NEXT_PUBLIC_REDIRECT_URI
