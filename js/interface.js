$(document).ready(function () {
    loadInterface();
});

var loadInterface = function(){

    //Поля ввода
    var inputs = $('input[type="text"], textarea');
    $.each(inputs, function(){
        var input = $(this);
        var hiddenClass = 'hidden';
        if(checkForValue(input)) hiddenClass = '';
        if($(input).hasClass('allow-clear')) {
            $(input)
                .wrap('<div class="input-container"></div>')
                .before('<div class="clear ' + hiddenClass + '"></div>');
            $(input).siblings('.clear').on('click', function () {
                $(input).val('');
                $(this).addClass('hidden');
            });
            $(input).on('keyup', function () {
                if (checkForValue(input)) {
                    $(this).siblings('.clear').removeClass('hidden');
                } else {
                    $(this).siblings('.clear').addClass('hidden');
                }
            });
        }
    });

}
var checkForValue = function(element){
    if($(element).val().length) {return true} else{return false}
}
