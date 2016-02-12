/**
 * WARNING:
 *
 * This file is used on both landing.goclio.com and also on www.goclio.com.  When modified, please make sure
 * that it is properly referenced from (and works correctly in) both those locations!
 **/

jQuery(document).ready(function() {
  saveMarketingInformation();
  if(jQuery('form').length) {
    loadMarketingInformation();
  }

});