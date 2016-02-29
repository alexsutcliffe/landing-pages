function saveMarketingInformation(){var domain_parts=window.location.host.split(".");the_domain="."+domain_parts[1]+"."+domain_parts[2];for(var cookie_options={domain:the_domain,expires:90,path:"/"},fields=["gclid","member_id","promotional_code","referral_code","bar_landing_url","utm_campaign","utm_content","utm_medium","utm_source","utm_term"],i=0;i<fields.length;i++){var value=getParameterByName(fields[i]);value&&jQuery.cookie("mkt_"+fields[i],value,cookie_options)}var referrer=document.referrer;if(!referrer||referrer.match(/^https?:\/\/[^\/]*goclio\.com\//)||referrer.match(/^https?:\/\/[^\/]*clio\.com\//)||referrer.match(/^https?:\/\/[^\/]*clio\.co.uk\//)||referrer.match(/^https?:\/\/[^\/]*clio\.eu\//)||null!=jQuery.cookie("mkt_referrer")||jQuery.cookie("mkt_referrer",referrer,cookie_options),null==jQuery.cookie("mkt_landing_url")&&jQuery.cookie("mkt_landing_url",document.location,cookie_options),window.optimizely&&window.optimizely.data){var allExperiments=window.optimizely.data.experiments,experimentVariationNames="";for(var id in allExperiments)if(allExperiments.hasOwnProperty(id)){var experimentId=id,variationName=window.optimizely.data.state.variationNamesMap[experimentId],experimentName=window.optimizely.data.experiments[experimentId].name;experimentVariationNames+=(""!=experimentVariationNames?" | ":"")+experimentName+":"+variationName}""!=experimentVariationNames&&jQuery.cookie("mkt_optimizely_data",experimentVariationNames,cookie_options)}}function getParameterByName(name){name=name.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var regexS="[\\?&]"+name+"=([^&#]*)",regex=new RegExp(regexS),results=regex.exec(window.location.href);return null==results?"":decodeURIComponent(results[1].replace(/\+/g," "))}function loadMarketingInformation(){for(var fields=["gclid","landing_url","member_id","referrer","bar_landing_url","utm_campaign","utm_content","utm_medium","utm_source","utm_term","optimizely_data"],i=0;i<fields.length;i++){var theField=fields[i].substring(0,255),value=jQuery.cookie("mkt_"+theField);if(value){var source,theValue=decodeURIComponent(value).substring(0,512),inputElem=jQuery("<input>").attr("type","hidden").attr("name","marketing_tracker["+theField+"]").val(theValue);switch(theField){case"optimizely_data":source="Optimizely";break;case"utm_campaign":case"utm_content":case"utm_medium":case"utm_source":case"utm_term":source="Google";break;default:source="Clio Marketing Tracker"}var theSource=source.substring(0,255),marketing_tracker_field_key=jQuery("<input>").attr("type","hidden").attr("name","marketing_tracker_values["+i+"][key]").val(theField),marketing_tracker_field_value=jQuery("<input>").attr("type","hidden").attr("name","marketing_tracker_values["+i+"][value]").val(theValue),marketing_tracker_field_source=jQuery("<input>").attr("type","hidden").attr("name","marketing_tracker_values["+i+"][source]").val(theSource);jQuery("form").append(inputElem,marketing_tracker_field_key,marketing_tracker_field_value,marketing_tracker_field_source)}}var promotional_code=jQuery.cookie("mkt_promotional_code");promotional_code&&jQuery("#marketing_tracker_promotional_code").val(promotional_code);var referral_code=jQuery.cookie("mkt_referral_code");referral_code&&jQuery("#marketing_tracker_referral_code").val(referral_code.replace(/%20/g,""))}jQuery.cookie=function(name,value,options){if("undefined"==typeof value){var cookieValue=null;if(document.cookie&&""!=document.cookie)for(var cookies=document.cookie.split(";"),i=0;i<cookies.length;i++){var cookie=jQuery.trim(cookies[i]);if(cookie.substring(0,name.length+1)==name+"="){cookieValue=decodeURIComponent(cookie.substring(name.length+1));break}}return cookieValue}options=options||{},null===value&&(value="",options.expires=-1);var expires="";if(options.expires&&("number"==typeof options.expires||options.expires.toUTCString)){var date;"number"==typeof options.expires?(date=new Date,date.setTime(date.getTime()+24*options.expires*60*60*1e3)):date=options.expires,expires="; expires="+date.toUTCString()}var path=options.path?"; path="+options.path:"",domain=options.domain?"; domain="+options.domain:"",secure=options.secure?"; secure":"";document.cookie=[name,"=",encodeURIComponent(value),expires,path,domain,secure].join("")},jQuery(document).ready(function(){saveMarketingInformation(),jQuery("form").length&&loadMarketingInformation()});