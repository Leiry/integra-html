$(document).ready(function () {
//		sessionManager.pause();
    $('#modal-text-task').on('hide.bs.modal', function () {
        return confirm('Вы уверены, что хотите отменить отправку отчета? Текст и файлы будут утеряны');
    });
});

$(document).on('click', '.btnStart', function (event) {
    if ($(this).attr('data-report-type') == 'text') {
        var modal_name = 'Отчет по практике к уроку №' + $(this).attr('data-lesson-number') + ' задание №' + $(this).attr('data-task-number');
        var taskId  = $(this).attr('data-task-id');
        $.ajax({
            type: 'POST',
            url: '/study/index/check_text_report',
            data: {taskId: taskId},
            cache: false,
            success: function (result)
            {
                var json    = JSON.parse(result);
                if (json.exists)
                {
                    ohSnap('У вас уже есть отправленный отчет по данному заданию', 'yellow');
                }
                else
                {
                    $('#modal-text-task').modal('show');

                    $('#modal-text-task .modal-title').text(modal_name)
                    $('#modal-text-task input[name="task_id"]').val(taskId);

                    $('#task-text').html($('#task-text-' + taskId).html());
                    $('#task-comment').html($('#task-comment-' + taskId).html());
                }
            }
        });
    }
    if ($(this).attr('data-report-type') == 'session') {
        var modal_name = 'Выполнение задания №'+$(this).attr('data-task-number')+' к уроку №'+$(this).attr('data-lesson-number');
        $('#modal-session-task').modal();
        $('#modal-session-task .modal-title').text(modal_name)
        $('#modal-session-task input[name="task_id"]').val($(this).attr('data-task-id'));
    }
});

$(document).on('click', '.btnToReport', function () {
    document.location.href = '/reports?lesson=' + $(this).attr('data-lesson-id') + '&task=' + $(this).attr('data-task-id') + '';
});

function confirm_delete() {
    if (confirm("Вы уверены, что хотите отменить отправку отчета? Текст и файлы будут утеряны")) {
        $('#modal-text-task').modal('hide')
    } else
        return false;
}

function sendReport() {
    $('#modal-text-task #files').addClass('hidden');
    $('#modal-text-task #send').removeClass('hidden');
    $.ajax({
        url: '/study/index/send_report/',
        type: 'POST',
        data: new FormData($('#modal-text-task #sendReport')[0]),
        processData: false,
        contentType: false,
        success: function (data) {
            $('#modal-text-task #send').addClass('hidden');
            try {
                var json = JSON.parse(data);
                if (json.error) {
                    ohSnap(json.errorDesc, 'red')
                } else {
                    $('#modal-text-task #success').removeClass('hidden');
                    setTimeout(function () {
                        window.location    = window.location.href.split('#')[0];
                    }, 1000);
                }
            } catch (e) {
            }
        },
        error: function () {

        }
    });
}



function createSoloSession() {
    $.ajax({
        type: 'POST',
        url: '/study/index/create_solo_session',
        data: {taskId: $('#modal-session-task input[name="task_id"]').val()},
        cache: false,
        success: function (result) {
            try {
                var json = JSON.parse(result);
                if (json.status == 'success') {
                    window.location = sessionRoomUrl + '/sessionRoom/' + json.roomId + '?flowId=' + flowId;
                } else {
                    if (json.error == 'session_exists')
                    {
                        $('#modal-session-task #enter').addClass('hidden')
                        $('#modal-session-task #roomLink').attr('href', 'http://' + location.hostname + '/sessionRoom/' + json.roomId + '?flowId=' + flowId);
                        $('#modal-session-task #sessionExists').removeClass('hidden');
                    }
                    else
                    {
                        alert('Произошла ошибка');
                    }
                }
            } catch (e) {
                alert('Произошла ошибка');
            }
        }
    });
}

function inviteForeignClient ()
{
    var mail            = $('#modal-session-task input[name="mail"]').val();
    var foreignClient   = $('#modal-session-task select[name="foreignClient"]').val();
    var taskId          = $('#modal-session-task input[name="task_id"]').val();

    if (!mail && !foreignClient)
    {
        ohSnap('Введите e-mail или выберите из списка', 'red');
    }
    else
    {
        $.ajax({
            url: '/study/index/invite_foreign_client',
            type: 'POST',
            data: {mail: mail ? mail : false, foreign: foreignClient ? foreignClient : false, taskId: taskId},
            cache: false,
            success: function (result)
            {
                var json    = JSON.parse(result);
                if (json.error)
                {
                    ohSnap(json.errorDesc, 'red');
                }
                else
                {
                    if (json.last)
                    {
                        $('#modal-session-task #errors').removeClass('hidden');
                        $('#modal-session-task #link').val('http://' + location.hostname + '/sessionRoom/' + json.roomId + '?flowId=' + flowId + '&token=' + json.token);
                        $('#modal-session-task #myLink').attr('href', 'http://' + location.hostname + '/sessionRoom/' + json.roomId + '?flowId=' + flowId);
                        $('#modal-session-task #foreign').addClass('hidden');
                        $('#modal-session-task #resultForeign').removeClass('hidden');
                    }
                    else
                    {
                        $('#modal-session-task #errors').addClass('hidden');
                        $('#modal-session-task #link').val('http://' + location.hostname + '/sessionRoom/' + json.roomId + '?flowId=' + flowId + '&token=' + json.token);
                        $('#modal-session-task #myLink').attr('href', 'http://' + location.hostname + '/sessionRoom/' + json.roomId + '?flowId=' + flowId);
                        $('#modal-session-task #foreign').addClass('hidden');
                        $('#modal-session-task #resultForeign').removeClass('hidden');
                    }
                }
            }
        })
    }
}

$(document).ready(function ()
{
    if (window.location.hash)
    {
        var reportId    = window.location.hash.split('/')[1];
        var text    = '';
        $.ajax({
            type: 'POST',
            url: '/reports/index/view/' + reportId,
            data: {ajax: true},
            cache: false,
            success: function (result)
            {
                var json    = JSON.parse(result);

                $.ajax({
                    type: 'POST',
                    url: '/study/index/check_text_report',
                    data: {taskId: json.taskIdIndividual},
                    cache: false,
                    success: function (result)
                    {
                        var check    = JSON.parse(result);
                        if (check.exists)
                        {
                            ohSnap('У вас уже есть отправленный отчет по данному заданию', 'yellow');
                        }
                        else
                        {
                            text    = json.text;

                            var modal_name = 'Отчет по практике к уроку №' + json.lesson_num + ' задание №' + json.task_num;
                            $('#modal-text-task .modal-title').text(modal_name)
                            $('#modal-text-task input[name="task_id"]').val(json.taskIdIndividual);
                            $('#task-text').html(json.task_text);
                            $('#task-comment').html(json.comment);
                            $('#insert-button').show();
                            $('#modal-text-task').modal('show');
                        }
                    }
                });
            }
        });

        $(document).on('click', '#insert-button', function () {
            $('#report-text').val(text);
        });
    }
});