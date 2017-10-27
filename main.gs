/* 
 * Returns the HTML of a defined number of results for an input query and defined filters
 * @param {string} search_data - Query from UI.
 * @param {array}{string} Filters - list of filters to apply
 * @param {string} length - Number of results to return
 * @returns {HTML} htmlBody of evaluated template 'resultsPage' with search results data
*/
function searchByParams(query, filters, length) {
  //if (query==undefined){query ='standard';}
  if (query!=undefined){
    if (filters==undefined){var filters='';}
    if (length==undefined){var length=6;}
    var searchResults=searchPOST(query,filters,length);
    if(searchResults!=undefined){
    var parsedResults=JSON.parse(searchResults).results;
    for (var i=0;i<parsedResults.length;i++){
      var result = parsedResults[i];
      var contentData = contentById(result.id, 'json');
      result.tracking.clickCode = contentData.link;Logger.log(result.attributes.Answer)
    }
    var t = HtmlService.createTemplateFromFile('resultsPage');
    t.data = ['"'+query+'"', length, parsedResults];
    var htmlBody = t.evaluate().getContent();
    
    return htmlBody
    }else{Logger.log("searchPOST respose is undefined");return "searchPOST respose is undefined"}
  }else{Logger.log("'q' is undefined in SearchByParams");return "'q' is undefined in SearchByParams"}
}
