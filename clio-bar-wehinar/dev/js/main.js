$(function() {
	// Add ie class to the doc for ie browsers
	if(window.ActiveXObject || "ActiveXObject" in window){
		$('html').addClass('ie');
	}

	var geoIP_actions = (function(){

		var emea = [
			'AL','DZ','AD','AO','AT','BH','BY','BE','BJ','BA','BW','BG','BF','BI','CM','CV','CF','TD',
	        'KM','HR','CY','CZ','CD','DK','DJ','EG','GQ','ER','EE','ET','FO','FI','FR','FX','GA','GM','GE',
	        'DE','GH','GI','GB','GR','GG','GN','GW','HU','IS','IR','IQ','IE','IM','IL','IT','CI','JE','JO',
	        'KE','KW','LV','LB','LS','LR','LY','LI','LT','LU','MK','MG','MW','ML','MT','MR','MU','MD','MC',
	        'ME','MA','MZ','NA','NL','NE','NG','NO','OM','PS','PK','PL','PT','QA','RO','RU','RW','SM','ST','SA','SN',
	        'RS','CS','SK','SI','SO','ZA','ES','SD','SJ','SZ','SE','CH','SY','TZ','TG','TN','TR','UG','UA',
	        'AE','VA','EH','YE','ZM','ZW','EU'
		];

		var caslField = function(){
			if (window.countryCode !== "CA") {	
				MktoForms2.whenReady(function (form){
					if($("form .mktoFormRow").length) {
						var caslCheckbox = $('input[name="CASL_Most_Recent_Opt_in__c"]');
						var caslLabel = $('label[for="CASL_Most_Recent_Opt_in__c"]');
						$(caslCheckbox).closest('.mktoFormRow').remove();
						$(caslCheckbox).remove();
						$(caslLabel).remove();
					}
				});
				if($("form#clio_signup_form").length) {
					var caslCheckbox = $('input[name="signup[casl_opt_in]"]');
					var caslLabel = $('label[for="signup_casl"]');
					$(caslCheckbox).remove();
					$(caslLabel).remove();
					$(".casl_row").remove();
				}
			}
		};

		var setRegionField = function(){
			if ($("form#clio_signup_form").length) {
				var formRegionCode = $('input[name="marketing_tracker[region_code]"]');
				if(window.countryCode == "GB"){
					formRegionCode.val('1'); // UK
				}else if($.inArray(window.countryCode, emea) > -1){
					formRegionCode.val('2'); // EU
				}else{
					formRegionCode.val('0'); // Rest of the world
				}
			}

		};

		var setPostURL = function(){
			if ($("form#clio_signup_form").length) {
				var form = $("form#clio_signup_form");
				if(window.location.href.indexOf("sandbox") == -1){
					if(window.countryCode == "GB"){
						$(form).attr('action','https://app.goclio.eu/marketing_signup'); // UK
					}else if($.inArray(window.countryCode, emea) > -1){
						$(form).attr('action','https://app.goclio.eu/marketing_signup'); // EU
					}else{
						$(form).attr('action','https://app.goclio.com/marketing_signup'); // Rest of the world
					}
				}
			}	
		};

		var setPlanCode = function(){
			if ($("form#clio_signup_form").length) {
				if(window.countryCode == "GB"){
					document.getElementById('clio_al_subscription_plan_code').value = "2"; // UK
				}else if($.inArray(window.countryCode, emea) > -1){
					document.getElementById('clio_al_subscription_plan_code').value = "2"; // EU
				}else{
					document.getElementById('clio_al_subscription_plan_code').value = "4"; // Rest of the world
					// if subscription code exists and a valid number
					var isPlanCodeValid = function(code){
						if ((code != null) && (code != '') && !((code < 2) || (code > 5)) && !isNaN(code)) {
							return true;
						}else{
							return false;
						}
					};
					// Get the al_subscription_plan_code
				    var planCode = getParameterByName('al_subscription_plan_code');
				    // Assign plan code to the hidden field .
				    if (isPlanCodeValid(planCode)) { 
						document.getElementById('clio_al_subscription_plan_code').value = planCode;
					}
				}
			}
		};

		// Display UK content for GB and IE
		var displayGeoContentBlock = function(){
			if ($('.geo_content_block').length) {
				if((window.countryCode == "GB") || (window.countryCode == "IE")){ 
					//show uk content blog
					$('.uk_content_block').css({'display':'block'});
					$('.global_content_block').remove();
				}else{
					//show global content blog
					$('.global_content_block').css({'display':'block'});
					$('.uk_content_block').remove();
				}
			} 
		};

		var setPhoneNumber = function(){
			if ($('.support-phone').length) {
				var uk_support_num = '+44.800.433.2546';
				var global_support_num = '1.888.858.2546';
				if((window.countryCode == "GB") || (window.countryCode == "IE")){ 
					// show uk support phone number
					$('.support-phone').text(uk_support_num);
				}else{
					// show global support phone
					$('.support-phone').text(global_support_num);
				}
			}
		};
		

		var setPhoneMinLength = function(){
			if ($("form#clio_signup_form").length) {
				var phoneField = $("form#clio_signup_form input#clio_signup_phone_number");
				$(phoneField).attr('minlength', 10);
				if($.inArray(window.countryCode, emea) > -1){
					$(phoneField).attr('minlength', 5);
				}else{
					$(phoneField).attr('minlength', 10);
				}
			}
		};

		// On GeoIP location lookup
		var onSuccess = function (geoipResponse) {
			window.countryCode = geoipResponse.country.iso_code;
			setPhoneNumber();
			displayGeoContentBlock();
			setPostURL();
			caslField();
			setRegionField();
			setPlanCode();
			setPhoneMinLength();
		};
		var onError = function(error){
			window.countryCode = 'US';
		};
		
		geoip2.country(onSuccess, onError);
		
	});

	geoIP_actions();

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



	// Sign up trial form
	if ($('#clio_signup_form').length) {

		// Expand Promotion code field
		document.getElementById('clio_promo_link').addEventListener('click', function(e) {
            e.preventDefault();
            var elements = document.querySelectorAll('.signup-form__code');
            for (var i = 0; i < elements.length; i++){
                var element = elements[i]; 
                element.style.display = 'block';
            }
            document.querySelectorAll('.signup-form__promo-link')[0].style.display = 'none';
        });

		jQuery.validator.addMethod("naming", function(value, element) {
			return this.optional( element ) || /^[a-zA-Z\s\-']+$/.test(value );
		});

		$( "#clio_signup_form" ).validate({
			rules: {
				"signup[first_name]":{
					required: true,
					naming: true,
					maxlength: 96
				},
				"signup[last_name]":{
					required: true,
					naming: true,
					maxlength: 96
				},
				"signup[email]":{
					required: true,
					maxlength: 64
				},
				"user[password]": { 
				  	required: true,
				  	minlength: 6,
				  	maxlength: 40
				},
				"signup[phone_number]": {
				  	required: true,
				}
			},
			messages: {
				"signup[first_name]":{
					required: "Please enter your first name.",
					naming: "First name only allows letters, spaces, apostrophes, and hyphens."
				},
				"signup[last_name]":{
					required: "Please enter your last name.",
					naming: "Last name only allows letters, spaces, apostrophes, and hyphens."
				},
				"signup[email]":{
					required: "Please enter your email."
				},
				"user[password]":{
					required: "Please enter your password."
				},
				"signup[phone_number]":{
					required: "Please enter your phone number."
				}
			},
			submitHandler: function () {
	        	if(jQuery( "#clio_signup_form").valid()){
				  	jQuery("#clio_signup_form input#submit")
				  	.attr({
				  		"value" : "Please wait"
				  	}).css({
					  	"background-color" : "#20ad4d",
					  	"cursor": "default"			  
					});
					var form_success = true; 
			    }
        		return true; 
    		}
		});
		
	}


	// Footer year
	var d = new Date();
	var y = d.getFullYear();
	$('span.copy-year').html(y);

    var $url = $(location).attr('href');
    // Video Play Tracking
    //Vimeo player
    if ($('#player1').length) {
        var player = $("#player1");
        var $videoName = '';
        froogaloop = $f(player[0].id);
        $("button.play1").click(function(e){
            e.preventDefault();
            $('.video-wrap').css({'display':'block'});
            $(this).remove();
            froogaloop.api('play');
            if ($(player).is('[data-video-name]')) {
                $videoName = $(player).attr("data-video-name");
            }else{
                $videoName = "Clio Video";
            }
            _gaq.push(['_trackEvent', 'Video Plays', $videoName, + "'" + $url + "'"]);
        }); 
    }

    // Scroll to an anchor
	$(".scroll").click(function(e) {
		e.preventDefault();
		var target = $(this).attr('data-target');
	    $('html,body').animate({
	        scrollTop: $("#"+target).offset().top
	    }, 600);
	});

});