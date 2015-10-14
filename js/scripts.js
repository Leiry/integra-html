$(function() {

    // Checkboxes & Radio
    $('select, input:not(input.switch)').styler({
        wrapper: 'div.radio-group'
    });

    // $('input').click(function(){
    //     console.log($('input[name="radio"]:checked').val());
    // });
   



    // Switch
    $('.switch div').click(function(){
        $(this).parent().children('div').removeClass('active');
        $(this).addClass('active');
        if ($(this).attr('data-button') == 'yes')
        {
            practiceReady('coach');
            $('#practice-ready #roles-title').removeClass('text-disabled');
            $('#practice-ready #roles-title').addClass('text');
            $('#practice-ready #roles-buttons').removeClass('disabled');
        }
        else if ($(this).attr('data-button') == 'no')
        {
            practiceReady('no')
            $('#practice-ready #roles-title').removeClass('text');
            $('#practice-ready #roles-title').addClass('text-disabled');
            $('#practice-ready #roles-buttons').addClass('disabled');
        }
    });

    // Tooltips
    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    })

    // Content Collapse
    $('.collapse-block > .expand-btn').on('click', function(e) {
        e.preventDefault();
        var $_this = $(this);
        var $_collapse = $_this.parent().find('.collapsible');
        var a = 'описание';
        if ($_this.hasClass('search')) {
            var a = 'поиск';
        }
        if ($_this.hasClass('text-data')) {
            var a = 'текст задания';
        }
        if (!($_this.hasClass('active'))){
            $_this.text('Свернуть' + ' ' + a).addClass('active');
        } else {
            $_this.text('Развернуть' + ' ' + a).removeClass('active');
        }
        $_collapse.slideToggle();       
    })

    //chat button activation
    $('.chat-input').on('keyup', function () {
        if ($(this).val()){
            $(this).parents('.post').find('.chat-btn').removeAttr('disabled');
        } else {   
            $(this).parents('.post').find('.chat-btn').attr('disabled','disabled'); 
        }      
    });

    // Range-Slider
    $(".range-slider.speed").slider({
        range: "min",
        min: 0.5,
        max: 2,
        value: 1,
        step: 0.5,
        create: function( event, ui ) {},
        change: function( event, ui ) {}
    })
        .each(function() {
            var opt = $(this).data().uiSlider.options,
                points = opt.max / opt.min,
                val = 0;
            for (var i = 0; i < points; i++) {
                val += opt.step;
                var el = $('<label>' + (val) + '</label>').css('left', ((val-opt.min)*100/(opt.max-opt.min)) + '%');
                $(".range-slider").append(el);
            }
        });
    $('.range-slider.speed').on( "slidechange", function( event, ui ){
        $(".range-slider.speed label").css('font-weight', '400');
        var a = $(this).children('.ui-slider-handle').css('left');
        $(".range-slider.speed label").each(function() {
            if ($(this).css('left') == a) {
                $(this).css('font-weight', '700');
            }
        }) 
    });

    // Calendar
    $('.datepicker').datepicker({
        // inline: true,
        currentText: 'Сегодня',
        monthNames: ['Январь','Февраль','Март','Апрель','Май','Июнь',
        'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
        monthNamesShort: ['Янв','Фев','Мар','Апр','Май','Июн',
        'Июл','Авг','Сен','Окт','Ноя','Дек'],
        dayNames: ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'],
        dayNamesShort: ['вск','пнд','втр','срд','чтв','птн','сбт'],
        dayNamesMin: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
        weekHeader: 'Нед',
        dateFormat: 'dd.mm.y',
        firstDay: 1
    });

    // Sidebar-hide button
    $('.aside .hide-panel').click(function(){
        var $_aside_and_main_container = $('.aside, .main-container');
        if ($_aside_and_main_container.hasClass('sidebar-active')) {
            $_aside_and_main_container.removeClass('sidebar-active');
        } else {
            $_aside_and_main_container.addClass('sidebar-active');
        }   
    });

    // Chat .buttons-right behaviour
    // if (!($('.chats-right .buttons-right').length)){
    //     $('.bottom-container').addClass('w100p');
    // }

    //  $(window).resize(function() {
    //     if ($('.scrollable').css('max-height'))
        
                   
    // });

    // $(window).trigger('resize');
	
    if ($('#remTime').get().length)
    {
        var s = $('#remTime').html().split(' ');
        console.log( s );
        rs = s.reverse();

        remainingTimer.min = parseInt( rs[1] || 0 );
        remainingTimer.hours = parseInt( rs[3] || 0 );
        remainingTimer.days = parseInt( rs[5] || 0 );

        console.log('d=', remainingTimer.days, ' h=', remainingTimer.hours, ' m=', remainingTimer.min);

        if(remainingTimer.days > 0)
        {
            console.log(3)
            $('#remTime').html(remainingTimer.days+' д '+remainingTimer.hours + ' ч ' + remainingTimer.min + ' мин');
        }
        else if(remainingTimer.hours > 0)
        {
            console.log(2)
            $('#remTime').html(remainingTimer.hours + ' ч ' + remainingTimer.min + ' мин');
        }
        else if(remainingTimer.min > 0)
        {
            console.log(1)
            $('#remTime').html( remainingTimer.min + ' мин');
        }

        setInterval( remainingTimer.tick, 60000);
    }
});

var remainingTimer = {
	cnt:0,
	tick:function()
	{
		console.log('d=', remainingTimer.days, ' h=', remainingTimer.hours, ' m=', remainingTimer.min);
		//var s = $('#remTime').html().split(' ');
		//console.log( s );
		//rs = s.reverse();
		//console.log( rs );
		
		var s = $('#remTime').html().split(' ');
		rs = s.reverse();
		
		remainingTimer.min = parseInt( rs[1] || 0 );
		remainingTimer.hours = parseInt( rs[3] || 0 );
		remainingTimer.days = parseInt( rs[5] || 0 );
		
		if(remainingTimer.hours == 0)
		{
			remainingTimer.days--;
			remainingTimer.hours = 23;
			remainingTimer.cnt++;
			console.log('CNT',remainingTimer.cnt)
			if(remainingTimer.cnt)
			{
				remainingTimer.hours = 0;
			}
		}
		
		if( remainingTimer.min > 0 )
		{
			remainingTimer.min--;
		}
		else
		{
			remainingTimer.hours--;
			remainingTimer.min=59;
		}
		
		
		if(remainingTimer.days > 0)
		{
			//console.log(3)
			$('#remTime').html(remainingTimer.days+' д '+remainingTimer.hours + ' ч ' + remainingTimer.min + ' мин');
		}
		else if(remainingTimer.hours > 0)
		{
			//console.log(2)
			$('#remTime').html(remainingTimer.hours + ' ч ' + remainingTimer.min + ' мин');
		}
		else if(remainingTimer.min > 0)
		{
			//console.log(1)
			$('#remTime').html( remainingTimer.min + ' мин');
		}
	
	}
}