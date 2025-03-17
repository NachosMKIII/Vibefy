/* terminalVariables =
  '$env:clientId="4a5d0df8f02649c9a121fe843b20824a" $env:clientSecret="c55a5dd7920441aa843a4af6afae8225"';

 clientId = "4a5d0df8f02649c9a121fe843b20824a";

 clientSecret = "c55a5dd7920441aa843a4af6afae8225";

 redirectURI = "http://localhost:8888/callback";

 makePostRequest =
   curl.exe -X POST "https://accounts.spotify.com/api/token"  `
-H "Content-Type: application/x-www-form-urlencoded"  `
-d "grant_type=client_credentials&client_id=4a5d0df8f02649c9a121fe843b20824a&client_secret=c55a5dd7920441aa843a4af6afae8225"

 metricId = "1rCIEwPp5OnXW0ornlSsRl?si=wGlAS6wQTH20qiHEZr-Pcg";

 requestMetricData =
  ' curl.exe "https://api.spotify.com/v1/artists/1rCIEwPp5OnXW0ornlSsRl?si=wGlAS6wQTH20qiHEZr-Pcg" `
    -H "Authorization: Bearer BQDwXJ0goEjKHHkpBeVK89t_xWOaJaQw03TxDV-RBjuNGKLX5z0_nRCok7O3V3TzoVF69Qsl1SrlEXjfoK_xsjimIVIzXrPQqv2ymyS6cgUuQ3fVA4S_uSX7FRUaFTy9Mr7L9FQQxVE"';

    
    curl.exe "https://api.spotify.com/v1/albums/4LileDrFwEUFB5UPA3AEia" `
    -H "Authorization: Bearer BQBX2CdLZetzmxfR2WqmvqHYfZXFoeczpo1t-gBGVBegTaJwIbMHa4beZpXlmRkauMmYxqpCUi4YX_yagM-sChHBW2HHc1V029QzYih3XHZ1U1pHsAf8W3W01Q25Il3dCTc1xp0ShyY" 


    */
