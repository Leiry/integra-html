$(document).ready(function () {
    $('#modal-session-task input[name=file]').on('change', function () {
        if ($(this).val().substr(-3).toLowerCase() != 'mp3') {
            $(this).val('');
            alert('Выбранный Вами файл не является mp3 файлом');
        }
    });

    $('#modal-text-task').on('hide.bs.modal', function () {
        return confirm('Вы уверены, что хотите отменить отправку отчета? Текст и файлы будут утеряны');
    });
});

$(document).on('click', '.btnStart', function (event) {
    if ($(this).attr('data-report-type') == 'text') {
        var modal_name = 'Отчет по практике к уроку №' + $(this).attr('data-lesson-number') + ' задание №' + $(this).attr('data-task-number');
        var taskId  = $(this).attr('data-task-id');
        $('#modal-text-task').modal();
        $('#modal-text-task .modal-title').text(modal_name)
        $('#modal-text-task input[name="task_id"]').val(taskId);
        $('#task-text').html($('#task-text-' + taskId).html());
        $('#task-comment').html($('#task-comment-' + taskId).html());
    }
    if ($(this).attr('data-report-type') == 'session') {
        var modal_name = 'Выполнение задания №'+$(this).attr('data-task-number')+' к уроку №'+$(this).attr('data-lesson-number');
        $('#modal-session-task').modal();
        $('#modal-session-task .modal-title').text(modal_name)
        $('#modal-session-task input[name="task_id"]').val($(this).attr('data-task-id'));


        $('#modal-session-task input[rel=datetimepicker]').datetimepicker({
            dateFormat: 'dd.mm.yy',
            timeFormat: 'HH:mm'
        });
    }
});

$(document).on('click', '.btnToReport', function () {
    document.location.href = '/reports?lesson=' + $(this).attr('data-lesson-id') + '&task=' + $(this).attr('data-task-id') + '';
});

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
                        location.reload()
                    }, 1000);
                }
            } catch (e) {
            }
        },
        error: function () {

        }
    });
}

function sendSessionReport(type) {
    if ((type == 'couple' && $('#modal-session-task input[name=partner_id]').val()) || type == 'solo') {
        $('#modal-session-task #upload').addClass('hidden');
        $('#modal-session-task #send').removeClass('hidden');

        $.ajax({
            url: '/study/index/send_session_report/',
            type: 'POST',
            data: new FormData($('#modal-session-task #sendSessionReport' + type)[0]),
            processData: false,
            contentType: false,
            success: function (data) {
                $('#modal-session-task #send').addClass('hidden');
                try {
                    var json = JSON.parse(data);
                    if (json.error) {
                        ohSnap(json.errorDesc, 'red');
                        $('#modal-session-task #upload').removeClass('hidden');
                    } else {
                        $('#modal-session-task #success').removeClass('hidden');

                        setTimeout(function () {
                            window.location.reload();
                        }, 1000);
                    }
                } catch (e) {
                }
            },
            error: function () {

            }
        });
    } else {
        ohSnap('Выберите партнера', 'red');
    }
}

function findByName(name, taskId) {
    if (name.length >= 3) {
        $.ajax({
            url: '/study/index/findPartnerByName',
            type: 'POST',
            data: {q: name, taskId: taskId},
            cache: false,
            success: function (data) {
                try {
                    var json = JSON.parse(data);
                    $('#modal-session-task #finded').removeClass('hidden');
                    $('#modal-session-task #finded').html('');
                    $.each(json, function (id, name) {
                        $('#modal-session-task #finded').append('<a href="#" onclick="setPartner(' + id + ', \'' + name + '\'); return false;">' + name + '</a> <br />');
                    });
                } catch (e) {
                }
            }
        });
    }
}

function setPartner(id, name) {
    $('#modal-session-task input[name=partner]').val(name);
    $('#modal-session-task input[name=partner_id]').val(id);
    $('#modal-session-task #finded').html('');
    $('#modal-session-task #finded').addClass('hidden');
}

function createSoloSession() {
    $.ajax({
        type: 'GET',
        url: '/study/index/create_solo_session',
        cache: false,
        success: function (result) {
            try {
                var json = JSON.parse(result);
                if (json.status == 'success') {
                    window.location = sessionRoomUrl + '/sessionRoom/' + json.roomId + '?flowId=' + flowId;
                } else {
                    ohSnap('Произошла ошибка', 'red');
                }
            } catch (e) {
                ohSnap('Произошла ошибка', 'red');
            }
        }
    });
}