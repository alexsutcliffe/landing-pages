/**
 * WARNING:
 *
 * This file is used on both landing.goclio.com and also on www.goclio.com.  When modified, please make sure
 * that it is properly referenced from (and works correctly in) both those locations!
 **/

/**
 * Cookie plugin
 *
 * Copyright (c) 2006 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */

/**
 * Create a cookie with the given name and value and other optional parameters.
 *
 * @example jQuery.cookie('the_cookie', 'the_value');
 * @desc Set the value of a cookie.
 * @example jQuery.cookie('the_cookie', 'the_value', { expires: 7, path: '/', domain: 'jquery.com', secure: true });
 * @desc Create a cookie with all available options.
 * @example jQuery.cookie('the_cookie', 'the_value');
 * @desc Create a session cookie.
 * @example jQuery.cookie('the_cookie', null);
 * @desc Delete a cookie by passing null as value. Keep in mind that you have to use the same path and domain
 *       used when the cookie was set.
 *
 * @param String name The name of the cookie.
 * @param String value The value of the cookie.
 * @param Object options An object literal containing key/value pairs to provide optional cookie attributes.
 * @option Number|Date expires Either an integer specifying the expiration date from now on in days or a Date object.
 *                             If a negative value is specified (e.g. a date in the past), the cookie will be deleted.
 *                             If set to null or omitted, the cookie will be a session cookie and will not be retained
 *                             when the the browser exits.
 * @option String path The value of the path atribute of the cookie (default: path of page that created the cookie).
 * @option String domain The value of the domain attribute of the cookie (default: domain of page that created the cookie).
 * @option Boolean secure If true, the secure attribute of the cookie will be set and the cookie transmission will
 *                        require a secure protocol (like HTTPS).
 * @type undefined
 *
 * @name jQuery.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */

/**
 * Get the value of a cookie with the given name.
 *
 * @example jQuery.cookie('the_cookie');
 * @desc Get the value of a cookie.
 *
 * @param String name The name of the cookie.
 * @return The value of the cookie.
 * @type String
 *
 * @name jQuery.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */
var flag = true;

$(window).load(function() {

jQuery.cookie = function(name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        // CAUTION: Needed to parenthesize options.path and options.domain
        // in the following expressions, otherwise they evaluate to undefined
        // in the packed version for some reason...
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};

// Retrieve a query string parameter by name.
function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regexS = "[\\?&]" + name + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(window.location.href);
  if (results == null)
    return "";
  else
    return decodeURIComponent(results[1].replace(/\+/g, " "));
}


// Capture and save (to browser cookies) all marketing information
// that is contained in our query parameters.  This happens on
// each page load.
function saveMarketingInformation() {
  var cookie_options = { domain: ".goclio.com", expires: 90, path: "/" };
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
    if ((value != null) && (value != "")) {
      jQuery.cookie("mkt_" + fields[i], value, cookie_options);
    }
  }

  // Capture referral URL if present, not a *.goclio.com site, and we don't already have
  // one captured (ideally, we just want the FIRST non-Clio referral URL).
  var referrer = document.referrer;
  if ((referrer != null) && (referrer != "")
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
}

// Load any marketing information that has been saved to our browser cookies into our
// form.

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
    'utm_term'
  ];

  // Load each of our straightforward fields, and add them to our
  // form as hidden inputs.
  for (var i = 0; i < fields.length; i++) {
    var value = jQuery.cookie("mkt_" + fields[i]);
    if ((value != null) && (value != "")) {
      var the_value = decodeURIComponent(value);
      var input_element = jQuery("<input name='marketing_tracker[" + fields[i] + "]' type='hidden' />");
      input_element.val(the_value);
      jQuery('form').append(input_element);
    }
  }

  var promotional_code = jQuery.cookie("mkt_promotional_code");
  if ((promotional_code != null) && (promotional_code != "")) {
    jQuery('#marketing_tracker_promotional_code').val(promotional_code);
  }

  var referral_code = jQuery.cookie("mkt_referral_code");
  if ((referral_code != null) && (referral_code != "")) {
    jQuery('#marketing_tracker_referral_code').val(referral_code.replace(/%20/g, ''));
  }
}

saveMarketingInformation();

if(jQuery('form').length){
  loadMarketingInformation();
  
}

});
