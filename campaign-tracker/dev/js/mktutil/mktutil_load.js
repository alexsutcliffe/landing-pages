/**
 * Javascript file to load the marketing information stored on the browser cookie.
 *
 * This file is used on mkutils.js and is mirrored on landing.goclio.co and goclio.com. Any changes
 * made to loadMarketingInformation function will need to be reflected here accordingly.
 */
function loadMarketingInformation() {
  var fields = [
    'gclid',
    'landing_url',
    'member_id',
    'referrer',
    'bar_landing_url',
    'utm_campaign',
    'utm_content',
    'utm_medium',
    'utm_source',
    'utm_term',
    'optimizely_data'
  ];

  // Load each of our straightforward fields, and add them to our
  // form as hidden inputs.
  for (var i = 0; i < fields.length; i++) {
    var theField = fields[i].substring(0, 255);
    var value = jQuery.cookie("mkt_" + theField);

    if (!!value) {
      var theValue = decodeURIComponent(value).substring(0, 512);
      var inputElem = jQuery("<input>").attr("type", "hidden").attr("name", "marketing_tracker[" + theField + "]").val(theValue);
      var source;

      switch(theField) {
        case 'optimizely_data':
          source = 'Optimizely';
          break;
        case 'utm_campaign':
        case 'utm_content':
        case 'utm_medium':
        case 'utm_source':
        case 'utm_term':
          source = 'Google';
          break;
        default:
          source = 'Clio Marketing Tracker';
      }

      var theSource = source.substring(0, 255);

      // Create marketing_tracker_values form fields. Seperate field for each of the value
      var marketingTrackerFieldKey = jQuery("<input>").attr("type", "hidden").attr("name", "marketing_tracker_values[" + i + "][key]").val(theField);
      var marketingTrackerFieldValue = jQuery("<input>").attr("type", "hidden").attr("name", "marketing_tracker_values[" + i + "][value]").val(theValue);
      var marketingTrackerFieldSource = jQuery("<input>").attr("type", "hidden").attr("name", "marketing_tracker_values[" + i + "][source]").val(theSource);
      jQuery('form').append(inputElem, marketingTrackerFieldKey, marketingTrackerFieldValue, marketingTrackerFieldSource);
    }
  }

  var promotionalCode = jQuery.cookie("mkt_promotional_code");
  if (!!promotionalCode) {
    jQuery('#marketing_tracker_promotional_code').val(promotionalCode);
  }

  var referralCode = jQuery.cookie("mkt_referral_code");
  if (!!referralCode) {
    jQuery('#marketing_tracker_referral_code').val(referralCode.replace(/%20/g, ''));
  }
}
