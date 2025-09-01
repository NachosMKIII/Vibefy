# This is an demonstrative project that uses the Spotify Web Playback SDK and API

# Since the spotify documentation was updated and since may 15/2025 only organizations can request an extended quote(i.e. setting the app to production mode) indie developers can not really launch an app that uses the spotify web playback SDK for people to access it, that is why the only way to see the app is running on your own or watching the demo video (youtube.com/IAMGOINGTOMAKEAVIDEOFORITLATER)

(More precisely there is a third option, i could deploy the app but then you would have to send me your email for me to add to the dashboard, which is really impractical and probably feels intrusive)

# To really experience the app you need an Spotify premium account or you will hit an error when trying to access a lot of the features.

# To run the app properly you need to a client ID, client secret and a callback route, create a Spotify App on the Spotify dashboard and

replace the variables found in the route.js files inside
/api/get-token
/api/refresh

# The variables that should be replaced with your own are

process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
process.env.NEXT_PUBLIC_REDIRECT_URI
process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET

# You can either replace them directly, change the name of each with your own, or create and .env file in the root and define the variables there, but be mindful that different frameworks have different ways of defining environment variables. eg.

VITE uses the prefix VITE\_ and imports them by using import.meta.env. while for Next.js you declare them with the prefix NEXT_PUBLIC (to expose it to client side) and import them with process.env

# On the Spotify dashboard, add your email(The one of your premium account) to the users list(the list in development mode supports a max of 25 users) and add a redirect URI that matches the one in your REDIRECT_URI variable

# Install dependencies with "npm install" on the terminal

# Run with "npm" run dev on the terminal
