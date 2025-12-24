# 1. Introduction

## This is an demonstrative project that uses the Spotify Web Playback SDK and API

- This my first project, the one i used for learning the basics of software engineering(yes, i know that it is a bit much for a first project but that's because i thought it would be easier), like design and interaction with a backend.

# 2. Features:

-It uses the spotify API for album and track info.
-Has different themes with each one containing it's own selection of tracks.
-Has a playlist functionality that is managed locally on localStorage.
-the App has a lot of attention to detail, try messing around with it and see what you can find.

# 3. App setup (for beginners):

-go to the repository: https://github.com/NachosMKIII/Vibefy
-click on the green "code" button
-(on the terminal) run: git clone https://github.com/NachosMKIII/Vibefy.git

# 4. running the app:

## Since the spotify documentation was updated and since may 15/2025 only organizations can request an extended quote(i.e. setting the app to production mode) indie developers can not really launch an app that uses the spotify web playback SDK for people to access it, that is why the only way to see the app is running on your own or watching the demo video (https://www.youtube.com/watch?v=iDAVwUUYhbg).

(More precisely there is a third option, i could deploy the app but then you would have to send me your email for me to add to the dashboard, which is really impractical and probably feels intrusive).

## To really experience the app you need an Spotify premium account or you will hit an error when trying to access a lot of the features.

## To run the app properly you need to a client ID, client secret and a callback route, create a Spotify App on the Spotify dashboard and replace the variables found in the route.js files inside:

/api/get-token
/api/refresh
/api/token

## The variables that should be replaced with your own are

process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
process.env.NEXT_PUBLIC_REDIRECT_URI
process.env.SPOTIFY_CLIENT_SECRET

## You can either replace them directly, change the name of each with your own, or create and .env file in the root and define the variables there(the latter is recommended).

## create a .env file with these variables

NEXT_PUBLIC_YOUR_SPOTIFY_CLIENT_ID
NEXT_PUBLIC_YOUR_REDIRECT_URI
YOUR_SPOTIFY_CLIENT_SECRET

# Spotify no longer allows for localhost or http urls(unless they are loopback adresses) so you need to use https locally, easiest way is using ngrok

1. Install ngrok and add the authtoken

2. Run ngrok http:PORT(e.g. 3000)

it will give you something like https//something-ngrok-wrote

3. On the spotify dashboard paste you URL and add "/callback" at the end

4. paste the url as your REDIRECT_URI variable in your env file

# Example of valid URL variable

NEXT_PUBLIC_REDIRECT_URI=https://something-ngrok-wrote//callback

## On the Spotify dashboard, add your email(The one of your premium account) to the users list(the list in development mode supports a max of 25 users) and add a redirect URI that matches the one in your REDIRECT_URI variable.

## Terminal

-cd Vibefy
-npm install
-npm run dev
