$(document).ready(function()
{
    $(".range-slider.speed").on('slidechange', function(event, ui){Player.changeSpeed(ui, this); });
    var data = {};
    $.post('/reports/index/loadmessage/' + reportId + '/0/100', data, function (data) {

        var html='';
        var curDate = '';
        var senders = {student:"Студент", curator:"Куратор"}
        if (data.length == 0)
        {
            $('#newpage0').after('пока нет сообщений');
            return ;
        }
        for( var indx in data)
        {
            var dateStr = data[indx].date.split(' ');
            var date = dateStr[0];
            var time = dateStr[1];
            if (curDate != date)
            {
                html += '<div class="date">'+date+'</div>';
                curDate = date;
            }


            html += '<div class="message"><div class="time">'+time+'</div><p><strong>'+senders[data[indx].sender]+'</strong></p>' +
            '<p>'+data[indx].text+'</p></div>';
        };
        $('#newpage0').append(html);
        $('#newpage0').scrollTop($('#newpage0')[0].scrollHeight);
        $( "#newpage0" ).scroll(function() {
            if( $('#newpage0').scrollTop() == 0)
            {
                Loader.get();
            }
        });
        Pager.feedPage()
    }, "json");

    $(document).on('click', '.chat-btn', function(event){ chat.sendNewMsg(this); });
});

var Player = {
    changeSpeed:function(ui, e)
    {
        var aid = document.getElementById('audioput-audio-id');
        aid.playbackRate = ui.value;
    }
};

function confirmSendReport (reportId, taskId, role)
{
    $('#confirmReportId').html(reportId);
    $('#confirmButton').click(function() {
        sendReport(reportId, taskId, role);
    })
    $('#modal-send-confirmation').modal('show');
}

function sendReport(reportId, taskId, role)
{
    $.ajax({
        url: '/reports/index/send_report/' + reportId,
        type: 'GET',
        success: function (result)
        {
            var json = JSON.parse(result);
            if (json.error)
            {
                ohSnap(json.errorDesc, 'red');
            }
            else
            {
                location.reload();
            }
        }
    });
}

function checkForm (obj)
{
    if ($('.jq-radio.checked').length == 0)
    {
        alert('Выберите оценку');
        return false;
    }

    if ($('input[name="comment"]').val().length == 0)
    {
        alert('Введите комментарий к оценке');
        return false;
    }

    $('input[name="isHelpful"]').val($('.jq-radio.checked').find('input[type="radio"][value="1"]').length);
    return true;
}

var Loader = {
    noLoad: false,
    get:function(e)
    {
        if (this.noLoad)
        {
            return ;
        }

        var data = {};
        var that = this;
        $('#newpage0').prepend('<div id="loading">Загрузка</div>');
        that.noLoad = true;
        $.get('/reports/index/loadmessage/' + reportId + '/'+Pager.getCurPage()+'/100', data, function (data) {
            if (data.length == 0)
            {
                $('#loading').remove();
                that.noLoad = true;
                return ;
            }

            var html = '';
            var curDate = '';
            var senders = {student:"Студент", curator:"Куратор"};
            var before = $('#newpage0')[0].scrollHeight;
            for(var indx in data)
            {
                var dateStr = data[indx].date.split(' ');
                var date = dateStr[0];
                var time = dateStr[1];
                if (curDate != date)
                {
                    html += '<div class="date">'+date+'</div>';
                    curDate = date;
                }


                html += '<div class="message"><div class="time">'+time+'</div><p><strong>'+senders[data[indx].sender]+'</strong></p>' +
                '<p>'+data[indx].text+'</p></div>';
            }

            setTimeout(function()
            {
                that.noLoad = false;
                $('#loading').remove();
                $('#newpage0').prepend(html);
                var after = $('#newpage0')[0].scrollHeight;

                setTimeout(function(){
                    $('#newpage0').scrollTop(after - before);
                }, 100)

                Pager.feedPage();
            }, 5000)


        }, "json");
    }
}
var Pager = {
    curPage : 0,
    itemsPerPage:100,
    getCurPage:function()
    {
        return this.curPage;
    },
    feedPage:function()
    {
        this.curPage+= 1;
    },
    getNextPage:function()
    {
        return this.curPage+1;
    }
};

var chat = {
    sendNewMsg: function (e)
    {
        var data = {};
        data.text = $('#message').val().trim();
        if (data.text == '')
        {
            return;
        }

        $.get('/reports/index/addmessage/' + reportId, data, function (data) {
            if (data.status == 'error')
            {
                alert('К сожалению, возникли неполадки при работе с сетью. Попробуйте чуть позже, пожалуйста');
            }

            var html = '';
            var dateStr = data.date.split(' ');
            var time = dateStr[1];


            html += '<div class="message"><div class="time">'+data.date+'</div><p><b>Студент</b></p>' +
            '<p>'+$('#message').val()+'</p></div>';
            $('#newpage0').append(html)

            $('#message').val('');

            $('#newpage0').scrollTop($('#newpage0')[0].scrollHeight);
            $('.chat-btn').prop('disabled', true)
        }, "json");

    }
}