/*  Capture and save (to browser cookies) all marketing information
*   that is contained in our query parameters.  This happens on
*   each page load.
*/
 
function saveMarketingInformation() {
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
  
  function getCookieOptions() {
    // We only want the root of the domain
    var hostname = window.location.hostname.replace(/(www.|landing.|app.)/g,'');
    var clioDomains = ['goclio.co.uk', 'goclio.eu', 'goclio.com'];
    if (clioDomains.indexOf(hostname) !== -1) {
      hostname = '.' + hostname;
    }
    return { domain: hostname, expires: 90, path: "/" };
  }

  // Capture each of our straightforward parameters, and record them
  // to matching cookies named "mkt_{field_name}".
  function captureParameters(cookieOptions) {
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

    fields.forEach(function(field) {
      var value = getParameterByName(field);
      if (!!value) {
        jQuery.cookie("mkt_" + field, value, cookieOptions);
      }
    });
  }

  // Capture referral URL if present, not a *.goclio.com site, and we don't already have
  // one captured (ideally, we just want the FIRST non-Clio referral URL).
  function captureReferrer(cookieOptions) {
    var referrer = document.referrer;
    if (!!referrer
      && (! referrer.match(/^https?:\/\/[^\/]*goclio\.com\//))
      && (! referrer.match(/^https?:\/\/[^\/]*clio\.com\//))
      && (! referrer.match(/^https?:\/\/[^\/]*clio\.co.uk\//))
      && (! referrer.match(/^https?:\/\/[^\/]*clio\.eu\//))
      && (jQuery.cookie("mkt_referrer") == null)) {
      jQuery.cookie("mkt_referrer", referrer, cookieOptions);
    }
  }

  // Capture the initial landing page (specified as 'initial' being if one hasn't been captured yet).
  function captureLandingPage(cookieOptions) {
    if (jQuery.cookie("mkt_landing_url") == null) {
      jQuery.cookie("mkt_landing_url", document.location, cookieOptions);
    }
  }

  // Capture the Optimizely Experiment and Variation info
  function captureOptimizely(cookieOptions) {
    if (window.optimizely && window.optimizely.data) {
      var allExperiments = window.optimizely.data.experiments;
      var experimentVariationNames =
        Object
          .keys(allExperiments)
          .map(function(experimentId){
            var variationName = window.optimizely.data.state.variationNamesMap[experimentId];
            var experimentName = window.optimizely.data.experiments[experimentId].name;
            return experimentName + " : " + variationName;
          })
          .join(" | ");

      if (experimentVariationNames.length !== 0) {
        jQuery.cookie("mkt_optimizely_data", experimentVariationNames, cookieOptions);
      }
    }
  }

  var cookieOptions = getCookieOptions();
  captureParameters(cookieOptions);
  captureReferrer(cookieOptions);
  captureLandingPage(cookieOptions);
  captureOptimizely(cookieOptions);
}