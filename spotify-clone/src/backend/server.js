const terminalVariables =
  '$env:clientId="4a5d0df8f02649c9a121fe843b20824a" $env:clientSecret="c55a5dd7920441aa843a4af6afae8225"';

const clientId = "4a5d0df8f02649c9a121fe843b20824a";

const clientSecret = "c55a5dd7920441aa843a4af6afae8225";

const redirectURI = "http://localhost:8888/callback";

const makePostRequest =
  ' curl -X POST "https://accounts.spotify.com/api/token"  \
-H "Content-Type: application/x-www-form-urlencoded"  \
-d "grant_type=client_credentials&client_id=$env:clientId&client_secret=$env:clientSecret"';

const metricId = "1rCIEwPp5OnXW0ornlSsRl?si=wGlAS6wQTH20qiHEZr-Pcg";

const requestMetricData =
  ' curl "https://api.spotify.com/v1/artists/1rCIEwPp5OnXW0ornlSsRl?si=wGlAS6wQTH20qiHEZr-Pcg" \
    -H "Authorization: Bearer  BQD0TnFtpoIkOL69Wy30dG2zKIlJAYsUGH-LTYu1s_m7dFlGxahAgXlV7Ol-EUpMqXwBrjVmh-8h2eLvE0zgH-cm9D3WdJaYPKaG1gDQOkXz3o_GCXFC0MC0t4YY3Ye4Iw62pp5h9ig"';
