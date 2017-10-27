/* 
 * (POST /auth || POST /refreshToken) && POST /apis
 * Returns tokens and API endpoints. 
 * output: data{inbenta_key, inbenta_secret, bearerToken, baseURL{search, knowledge, chatbot, ticketing}}
*/
function getApiData(){
  var clientName = "Inbenta";
  var inbenta_key = "<inbentaAPIKey>";
  var inbenta_secret = "<inbentaAPISecret>"; 
  var bearerToken = authPOST(inbenta_key, inbenta_secret);
  var baseURL = endpointsGET(inbenta_key, bearerToken);
  var data = {
    'inbenta_key' : inbenta_key,
    'inbenta_secret' : inbenta_secret,
    'bearerToken' : bearerToken, 
    'baseURL' : baseURL, 
    'clientName' : clientName
  };
  return data
}

/* POST /auth
* Returns Bearer token
* input: {inbenta_key, inbenta_secret}
* output: bearerToken
*/
function authPOST(inbenta_key, inbenta_secret) {
  // Best here is to retrieve the secret from your servers instead of saving it in the code
  var url = "https://api.inbenta.io/v1/auth";
  var bearerToken = "";
  var payload ={"secret":inbenta_secret};
  var headers = {'x-inbenta-key':inbenta_key};
  var options = {
        "method" : "POST",
        "headers": headers,  
        contentType:"application/x-www-form-urlencoded",
        payload: payload,  
        followRedirects : true,
        muteHttpExceptions: true};
  var result = UrlFetchApp.fetch(url, options);
  if (result.getResponseCode() == 200) {
    var params = JSON.parse(result.getContentText());
    bearerToken = params.accessToken;
    return bearerToken
  }else{Logger.log("Error in POST /auth");return undefined}
}

/* GET /apis
* Returns API endpoints. 
* input: {inbenta_key, bearerToken}
* output: data{search, km, chatbot, ticketing}}
*/
function endpointsGET(inbenta_key, bearerToken) {
  var url = "https://api.inbenta.io/v1/apis";
  var bearerToken = "Bearer "+ bearerToken;
  var headers = {
    'x-inbenta-key':inbenta_key,
    Authorization: bearerToken
  };
  var options = {
      method:"GET",
      "headers": headers,  
      followRedirects : true,
      muteHttpExceptions: true
  };
  var content = UrlFetchApp.fetch(url, options);
  if (content.getResponseCode() == 200) {
    var params = JSON.parse(content.getContentText());
    var apis = params.apis;
    apis.search = apis.search+"/v1";
    apis.knowledge = apis.knowledge+"/v1";
    apis.chatbot = apis.chatbot+"/v1";
    apis.ticketing = apis.ticketing+"/v1";
    return apis
  }
  Logger.log("Error in GET /apis");return undefined
}
