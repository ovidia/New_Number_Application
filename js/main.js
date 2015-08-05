var unsortedNumbers = [234,132,12, 400, 242, 123];
var sortedNumbers = [12,123,132,234,242,400];
var letter = ["E", "L", "E", "V", "E", "N"];
var scaleFactor = 1; // 1 means no scaling
var incorrectAnswers = 0;
var mute = true; 

$(document).ready(function() 
{	
    createDraggableElements();
    createDroppableElements();
    $('#happy').hide();
    $('#sad').hide();
    $('#fireworks-video').hide();
    $('.bubble').show().append("Drag and drop the numbers to find out how many times Mickey Mouse and his friends slipped on the slide.");
    
    $(window).resize(function() {
		resize();	
	});
    setTimeout(function() {
        $(window).trigger('resize');
    }, 1000);
   
    $('#restart').on('click', restart);
    $('#game-content').click(function () 
    {
        $('.bubble').hide().empty();
    });

    $('#sound').click(handleSound);
});

//used in all games for resizing and scaling their content
//resizes the #wrapper-div width and height keeping the aspect ratio and scales the content of the #content-div
function resize()
{
	var maxWidth  = $('#content').css("width").replace("px", "");
	var maxHeight = $('#content').css("height").replace("px", "");

    var w = window.innerWidth;
    var h = window.innerHeight;

    //do not scale if available resolution is bigger than max resolution
    if(w >= maxWidth && h >= maxHeight) {
        $('#content').css({'-webkit-transform': ''});
        $('#content').css({'-moz-transform': ''});
        $('#content').css({'-ms-transform': ''}); 
        $('#content').css({'-o-transform': ''});
	    $('#content').css({'transform': ''});
        $('#wrapper').css({ width: maxWidth, height: maxHeight });
        scaleFactor = 1;
        return;
    }
    
    scaleFactor = Math.min(w/maxWidth, h/maxHeight);    

    $('#content').css({'-webkit-transform': 'scale(' + scaleFactor + ')'});
    $('#content').css({'-moz-transform': 'scale(' + scaleFactor + ')'});
    $('#content').css({'-ms-transform': 'scale(' + scaleFactor + ')'});
    $('#content').css({'-o-transform': 'scale(' + scaleFactor + ')'});
    $('#content').css({'transform': 'scale(' + scaleFactor + ')'});
    $('#wrapper').css({ width: w, height: h });
}

function createDraggableElements()
{
	for( var i = 0 ; i < unsortedNumbers.length ; i++)
	{
		$('<div>' + unsortedNumbers[i] + '</div>')
			.attr('id', 'draggable-number' + i)
			.addClass('draggable-element element')
			.appendTo('#draggable-numbers-div')
			.draggable({
				stack:  '#droppable-numbers-div div',
				revert: true,
				start: function(event, ui) {startDrag(ui)},
				drag: function(event, ui) {drag(ui)}
			});
	}
}

function createDroppableElements()
{
	for( var i = 0 ; i < unsortedNumbers.length ; i++)
	{
		$('<div></div>')
			.attr('id', 'droppable-number' + i)
			.addClass('droppable-element element')
			.appendTo('#droppable-numbers-div')
			.droppable({
				accept: '#draggable-numbers-div div',
				hoverClass: 'hovered',
				over: overClass,
				out: removeOverClass,
				drop: handleDrop
			});
	}
}

function startDrag(ui)
{
	ui.position.left = 0;
	ui.position.top = 0;
}

function drag(ui)
{
	var left = ui.position.left - ui.originalPosition.left;
	var newLeft = ui.originalPosition.left + left/scaleFactor;

	var top = ui.position.top - ui.originalPosition.top;
	var newTop = ui.originalPosition.top + top/scaleFactor;

	ui.position.left = newLeft;
	ui.position.top = newTop;
}

function overClass(event, ui)
{
	ui.draggable.addClass('over');
}

function removeOverClass(event, ui)
{
	ui.draggable.removeClass('over');
}

function handleDrop(event, ui)
{
	var dropDivIndex = $(this).attr('id').substring(($(this).attr('id').length-1), ($(this).attr('id').length) );
	var dragDivIndex = ui.draggable.attr('id').substring(($(this).attr('id').length-1), ($(this).attr('id').length) );
	
	$(this).droppable('disable');
	
	var number = ui.draggable.text();
	ui.draggable.remove();

	for(var i = 0; i < sortedNumbers.length ; i++)
        if (sortedNumbers[dropDivIndex] == number)
        {
            $('#droppable-number' + dropDivIndex).addClass('correct');
            playCorrectSound();
            $('#droppable-number' + dropDivIndex).attr("draggable", 'false'); 
            $(this).append("<label>" + letter[dropDivIndex] + "<br>" + number + "</label>").addClass('swing');  
            i = sortedNumbers.length;
        } 
        else
        {
        	$('#droppable-number' + dropDivIndex).addClass('incorrect');
        	playWrongSound();
        	$(this).append("<label><br>" + number + "</label>").addClass('swing'); 
        	incorrectAnswers++;          
            i = sortedNumbers.length;
        }	
        showMessage();
}

function showMessage()
{
	if($('#draggable-numbers-div').is(':empty') == true)
		if(incorrectAnswers != 0) 
		{
			$('#sad').show();
			$('.bubble').show().empty()
						.append("<h3>Try again!</h3>");
		}
		else
		{
			$('#happy').show();
			$('.bubble').show().empty()
						.append("<h3>We slipped on the slide ELEVEN times!</h3>");
			playVideo();
		}

	$('#game-content').click(function () 
    {
        $('.bubble').hide();
        $('#happy').hide();
        $('#sad').hide();
        $('video').hide();
    });
}

function restart()
{
	$('#draggable-numbers-div'). empty();
	$('#droppable-numbers-div').empty();

	createDraggableElements();
    createDroppableElements();

    $('#happy').hide();
    $('#sad').hide();
    $('#fireworks-video').trigger('pause').hide();
    incorrectAnswers = 0;
    
}

function playCorrectSound()
{
	$("#correct-choice-audio").trigger('play');
	document.getElementById("correct-choice-audio").playbackRate = 3.5; 
}

function playWrongSound()
{
	$("#wrong-choice-audio").trigger('play');
	document.getElementById("wrong-choice-audio").playbackRate = 2.0; 
}

function playVideo()
{
	$("#fireworks-video").show().trigger('play');
}

function handleSound()
{
	if(mute == true)
	{
		$('#sound').attr('src', '../img/sound-off-icon.png');
		mute = false;
		$('audio').prop('muted', !mute);
		$('video').prop('muted', !mute);
	}
	else
	{
		$('#sound').attr('src', '../img/sound-on-icon.png');
		mute = true;
		$('audio').prop('muted', mute);
		$('video').prop('muted', mute);
	}
}