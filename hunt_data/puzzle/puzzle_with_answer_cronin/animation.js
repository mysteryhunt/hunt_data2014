
// Constants and global variables

var global_data;
var data_index = 0;

var star_size = 10; // In pixels
var number_of_stars = 0;

var frame = 0;
var frame_rate = 60; // Frames per second

var star_delay = 5; // How many frames to wait for next star
var star_duration = 60; // How many frames each star lasts
var star_translation = 15; // How far each star moves per frame

function animate()
{
	// Check for end of the group
	if (frame > star_delay * (number_of_stars-1) + star_duration)
	{
		data_index += number_of_stars;
		
		// Run forever
		if (data_index >= global_data.length)
			data_index = 0;
		
		frame = 0;
	}

	for (var id = 0; id < number_of_stars; id++)
	{
	
		// Start and end frames for this star
		var start_frame = star_delay * id;
		var end_frame = start_frame + star_duration;
		
		if (frame == start_frame)
		{
			// Get one character from the data file, interpret it as hexadecimal
			var this_value = parseInt(global_data.charAt(data_index + id), 16);
			
			// Set the star position
			var top = Math.floor(($(window).height() / (number_of_stars/2) * this_value) + ($(window).height() / number_of_stars) - (star_size / 2));
			var left = Math.floor(Math.random() * $(window).width()) + star_translation * star_duration;
			left = Math.min(left, $(window).width() - star_size - 1);
			$("#star_"+id).css('left', left + "px");
			$("#star_"+id).css('top', top + "px");

			// Show star
			$("#star_"+id).css("display", "block");
			$("#star_"+id).css("visibility", "visible");
		}
		else if (start_frame < frame && frame < end_frame)
		{
			// Move star
			$("#star_"+id).css('left', "-="+star_translation);
		}
		else if (frame == end_frame)
		{
			// Hide star
			$("#star_"+id).css("display", "none");
			$("#star_"+id).css("visibility", "hidden");
		}
			
	}
	
	// Run animate() again in (1000 / frame_rate) milliseconds
	frame += 1;
	setTimeout(animate, Math.floor(1000 / frame_rate));
	
}

function initialize(count)
{
	number_of_stars = count;

	// Add stars to the body element
	for (var id = 0; id < number_of_stars; id++)
		$('body').append('<div class="star" id="star_' + id + '"></div>');
}

function begin_animation(data)
{
	// When the file is opened, start to animate
	global_data = data;
	animate();
}