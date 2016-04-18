$(function () {
	var types = ['SPEAKER', 'ORGANIZER', 'PARTICIPANT'];

	$("#type").click(function () {
		var n = types.indexOf($("#type").html());
		if (n == types.length - 1) n = 0;
		else ++n;
		var newType = types[n];
		$("#type").html(newType);
	});


	// AJAX search stuff

	function make_base_auth(user, password) {
		var tok = user + ':' + password;
		var hash = btoa(tok);
		return 'Basic ' + hash;
	}

	var formData = {
		"season": "spring",
		"event_type": "design_con",
		"year": 2016,
		"email": "ownz.andy@gmail.com"
	}
/*
	$.ajax({
		url: "http://hackduke-backend.herokuapp.com/participants/get_participant",
		type: "POST",
		dataType: 'jsonp',
		contentType: "application/json",
		data: formData,
		success: function (data, textStatus, jqXHR) {
			console.log('hi')
		},
		error: function (jqXHR, textStatus, errorThrown) {}
	});

*/
	// Checkin and Print
	$('#print').click(function () {
		if ($("#type").html() != "ADMIN") {
			query = $("#search input").val();
			var url = 'https://reg.hackduke.org/registration/checkin_member?email=' + query;

			$.ajax({
				url: url,
				type: 'GET'
			}).done(function (data) {
				if (data == "True") notify('&#10004; Checked In Successfully', true);
				else notify('Check In Error', false);
			}).fail(function () {
				notify('Check In Error', false);
			});
		}
		javascript: print();
	});

	// Cat updating
	$('#crop_cat_container').click(function () {
		$("#crop_cat").css("background-image", "url(http://thecatapi.com/api/images/get?format=src&type=jpg&size=small&" + new Date().getTime());
	});
	$('#crop_cat_container').click();

	/// Search Interface Setup
	$('#search').click(function () {
		$('#search input').focus();
	});

	// Presearch assignments
	var searched = '',
		query;
	$(document).keyup(function (e) {
		if (e.keyCode == 13 && $("#search input").is(":focus")) {
			search();
		}
	});
	$('#searchIcon').click(function () {
		search();
	});

	// Search operations
	function search() {
		query = $("#search input").val();
		var url = 'https://reg.hackduke.org/registration/admin?email=' + query + '&json=1';
		$.ajax({
			url: url,
			type: 'GET'
		}).done(function (data) {
			if (data.length == 0) notify('Person Not Found', false);
			else {
				notify('&#10004; Person Found', true);
				$('#first').val(data[0].fields.first_name);
				shrinkToFill($('#first'), fontSize, "", "Montserrat, sans-serif");
				$('#full').val(data[0].fields.first_name + ' ' + data[0].fields.last_name);
				generateBar(data[0].pk);
			}
		}).fail(function () {
			notify('Person Not Found', false);
		});
	}

	// Notifications
	function notify(msg, which) {
		if (which == true) which = 'good';
		else which = 'bad';
		var $which = $('#' + which);
		$which.html(msg);
		$which.fadeIn(150).css("display", "inline-block");
		setTimeout(function () {
			$which.fadeOut(300);
		}, 2000);
	}

	function px(input) {
		var emSize = parseFloat($("body").css("font-size"));
		return (input / emSize);
	}

	// Text resizing
	$(".resizer button").click(function () {
		var multiplier = 1;
		var $whichText = $('#first');
		if ($(this).parent().attr('id') == "r2") {
			$whichText = $('#full');
		}
		if ($(this).html() != "+") {
			multiplier = -1;
		}

		var currentSize = px(parseFloat($whichText.css('font-size')));
		$whichText.css('font-size', currentSize + (multiplier * .15) + 'em');
	});

	$('#first').keyup(function () {
		shrinkToFill(this, fontSize, "", "Montserrat, sans-serif");
	})

	function measureText(txt, font) {
		var id = 'text-width-tester',
			$tag = $('#' + id);
		if (!$tag.length) {
			$tag = $('<span id="' + id + '" style="display:none;font:' + font + ';">' + txt + '</span>');
			$('body').append($tag);
		} else {
			$tag.css({
				font: font
			}).html(txt);
		}
		return {
			width: $tag.width(),
			height: $tag.height()
		}
	}

	function shrinkToFill(input, fontSize, fontWeight, fontFamily) {
		var $input = $(input),
			txt = $input.val(),
			maxWidth = $input.width() + 5, // add some padding
			font = fontWeight + " " + fontSize + "em " + fontFamily;
		// see how big the text is at the default size
		var textWidth = measureText(txt, font).width;
		if (textWidth > maxWidth) {
			// if it's too big, calculate a new font size
			// the extra .9 here makes up for some over-measures
			fontSize = fontSize * maxWidth / textWidth * .9;
			font = fontWeight + " " + fontSize + "em " + fontFamily;
			// and set the style on the input
			$input.css({
				font: font
			});
		} else {
			// in case the font size has been set small and 
			// the text was then deleted
			$input.css({
				font: font
			});
		}
	}
});