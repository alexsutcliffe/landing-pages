/*  Capture and save (to browser cookies) all marketing information
*   that is contained in our query parameters.  This happens on
*   each page load.
*/
 
function saveMarketingInformation() {
  // var cookie_options = { domain: window.location.host, expires: 90, path: "/" };
  var cookie_options = { domain: window.location.host, expires: 90, path: "/" };
  var fields = [
    'gclid',
    'member_id',
    'promotional_code',
    'referral_code',
    'bar_landing_url',
    'utm_campaign',
    'utm_content',
    'utm_medium',
    'utm_source',
    'utm_term'
  ];

  // Capture each of our straightforward parameters, and record them
  // to matching cookies named "mkt_{field_name}".
  for (var i = 0; i < fields.length; i++) {
    var value = getParameterByName(fields[i]);
    if (!!value) {
      jQuery.cookie("mkt_" + fields[i], value, cookie_options);
    }
  }

  // Capture referral URL if present, not a *.goclio.com site, and we don't already have
  // one captured (ideally, we just want the FIRST non-Clio referral URL).
  var referrer = document.referrer;
  if (!!referrer
    && (! referrer.match(/^https?:\/\/[^\/]*goclio\.com\//))
    && (! referrer.match(/^https?:\/\/[^\/]*clio\.com\//))
    && (! referrer.match(/^https?:\/\/[^\/]*clio\.co.uk\//))
    && (! referrer.match(/^https?:\/\/[^\/]*clio\.eu\//))
    && (jQuery.cookie("mkt_referrer") == null)) {
    jQuery.cookie("mkt_referrer", referrer, cookie_options);
  }

  // Capture the initial landing page (specified as 'initial' being if one hasn't been captured yet).
  if (jQuery.cookie("mkt_landing_url") == null) {
    jQuery.cookie("mkt_landing_url", document.location, cookie_options);
  }

  // Capture the Optimizely Experiment and Variation info
  if (window.optimizely && window.optimizely.data) {
      var allExperiments = window.optimizely.data.experiments;
      var experimentVariationNames = "";

      for(var id in allExperiments) {
        if(allExperiments.hasOwnProperty(id)) {
          var experimentId = id;
          var variationName = window.optimizely.data.state.variationNamesMap[experimentId];
          var experimentName = window.optimizely.data.experiments[experimentId].name;
          experimentVariationNames += (experimentVariationNames != "" ? " | " : "") + experimentName + ":" + variationName;
        }
      }

      if (experimentVariationNames != ""){
        jQuery.cookie("mkt_optimizely_data", experimentVariationNames, cookie_options);
      }
  }

}

// Retrieve a query string parameter by name.
function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regexS = "[\\?&]" + name + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(window.location.href);
  if (results == null) {
    return "";
  } else {
    return decodeURIComponent(results[1].replace(/\+/g, " "));
  }
}