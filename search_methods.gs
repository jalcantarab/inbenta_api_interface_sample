/* POST /federated-search
 * Returns the JSON of a defined number of results for an input query and defined filters
 * @param {string} query - Query from UI.
 * @param {array}{string} filters - List of filters to apply
 * @param {string} length - Number of results to return
 * @returns {json}{processingTimeMs, results{attributes{Answer}, id, title, tracking{clickCode, rateCode} - A JSON objevt with the search results
*/ 
function searchPOST(query, filters, length) {
  if (query!=undefined){
    var credentials = getApiData(); // getApiData() from file auth_methods.gs
    var url = credentials.baseURL.search + "/federated-search";
    var BearerToken = "Bearer "+ credentials.bearerToken;
    if (filters==undefined){filters='';}
    if (length==undefined){length='10';}
    var payload ={
      "query":encodeURIComponent(query), //encodeURIComponent escapes all characters except A-Z,a-z,0-9,-,_,.,!,~,*,',(,)
      "length": length
    };
    var headers = {
      'x-inbenta-key': credentials.inbenta_key,
      'x-inbenta-env': '0',
      Authorization : BearerToken
    };
    var options = {
        method : "POST",
        "headers" : headers,  
        contentType : "application/x-www-form-urlencoded",
        payload : payload,  
        followRedirects : true,
        muteHttpExceptions : true
    };
    var result = UrlFetchApp.fetch(url, options);Logger.log(result.getContentText())
    if (result.getResponseCode() == 200) {
      var params = JSON.parse(result.getContentText());for (var i =0;i<params.results.length;i++){ Logger.log(params.results[i]);}
      return result.getContentText()
    }else{Logger.log("Error in POST /federated-search")}
  }else{Logger.log("query missing in searchPOST");return undefined}
}
