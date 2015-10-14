function showTasks(lesson) {
    $.ajax({
        url: '/reports/index/tasks/' + lesson,
        type: 'GET',
        success: function (data) {
            try {
                var tasks = JSON.parse(data);
                if (!tasks.error) {
                    $('#task')
                            .find('option')
                            .remove()
                            .end()
                            .append($('<option></option>')
                                    .attr("value", "")
                                    .text("Выберите задание")).trigger('refresh');

                    $.each(tasks.data, function (task_id, task_num) {
                        $('#task').append(
                                $('<option></option>')
                                .attr("value", task_id)
                                .text("Задание " + task_num)
                                );

                        $('#task').removeClass('disabled').removeAttr('disabled').trigger('refresh');
                    });
                }
                else
                {
                    $('#task')
                            .find('option')
                            .remove()
                            .end()
                            .append($('<option></option>')
                                    .attr("value", "")
                                    .text("Выберите задание")).addClass('disabled').trigger('refresh');
                }
            } catch (e) {
            }
        },
        error: function () {
            alert('Произошла ошибка');
        }
    });
}

function showSelectTasks(lesson) {
    $.ajax({
        url: '/reports/index/tasks/' + lesson,
        type: 'GET',
        success: function (data) {
            try {
                var tasks = JSON.parse(data);
                if (!tasks.error) {
                    $('#lb_fon #select_task')
                            .find('option')
                            .remove()
                            .end()
                            .append($('<option></option>')
                                    .attr("value", "")
                                    .text("Выберите задание"))
                            .removeAttr('disabled');

                    $.each(tasks.data, function (task_id, task_num) {
                        $('#lb_fon #select_task').append(
                                $('<option></option>')
                                .attr("value", task_id)
                                .text("Задание " + task_num.substring(0, 30))
                                );
                    });
                }
                else
                {
                    $('#lb_fon #select_task').prop('disabled', true)
                }
            } catch (e) {
            }
        },
        error: function () {
            alert('Произошла ошибка');
        }
    });
}

function confirmSendReport (reportId, taskId, role)
{
    $('#confirmReportId').html(reportId);
    $('#confirmButton').attr('onclick', 'sendReport(' + reportId + ', ' + taskId + ', \'' + role + '\');');
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
                alert(json.errorDesc);
            }
            else
            {
                $('#sendDate-' + reportId).html(json.sendDate);
                $('[attr-task-id-individual="' + taskId + '"][attr-task-role="' + role + '"]').prop('disabled', true);
                $('#modal-send-confirmation').modal('hide');
            }
        }
    });
}

function showSelectTaskModal(reportId)
{
    $('#modal-select-task').modal('show');
    $('#reportId').val(reportId);
}

function saveReportTask(reportId, taskId)
{
    $.ajax({
        type: 'POST',
        url: '/reports/index/save_report_task',
        cache: false,
        data: {reportId: reportId, taskId: taskId},
        success: function (result)
        {
            var json = JSON.parse(result);
            if (json.error)
            {
                alert(json.errorDesc);
            }
            else
            {
                $('#modal-select-task').modal('hide');
                window.location.reload();
            }
        },
        error: function ()
        {
            alert('Произошла ошибка');
        }
    });
}

function schoolDeleteReport() {
    var report = $("#reportId").html();

    $.ajax({
        url: '/reports/index/request_delete_report/' + report,
        type: 'GET',
        cache: false,
        success: function (data) {
            try {
                var json = JSON.parse(data);
                if (json.error == false) {
                    window.location.reload();
                } else {
                    alert('Произошла ошибка');
                }
            } catch (e) {
            }
        }
    });
}

function showModalConfirmDelete(reportId)
{
    $('#modal-example-confirm').modal('show');
    $('#reportId').html(reportId);
}

function schoolShowSelectTasks(lesson) {
    $.ajax({
        url: '/reports/index/tasks/' + lesson,
        type: 'GET',
        success: function (data) {
            try {
                var tasks = JSON.parse(data);
                if (!tasks.error) {
                    $('#select_task')
                            .find('option')
                            .remove()
                            .end()
                            .append($('<option></option>')
                                    .attr("value", "")
                                    .text("Выберите задание"))
                            .removeAttr('disabled');

                    $.each(tasks.data, function (task_id, task_num) {
                        $('#select_task').append(
                                $('<option></option>')
                                .attr("value", task_id)
                                .text("Задание " + task_num.substring(0, 30))
                                );
                    });
                    $('#select_task').trigger('refresh');
                }
                else
                {
                    $('#lb_fon #select_task').prop('disabled', true)
                }
            } catch (e) {
            }
        },
        error: function () {
            alert('Произошла ошибка');
        }
    });
}

function schoolSaveReportTask(reportId, taskId)
{
    $.ajax({
        url: '/reports/index/save_lesson_task',
        type: 'POST',
        cache: false,
        data: {report: reportId, task: taskId},
        success: function (data) {
            try {
                if (!JSON.parse(data).error) {
                    window.location.reload();
                } else {
                    alert('Произошла ошибка');
                }
            } catch (e) {
            }
        },
        error: function () {
            alert('Произошла ошибка');
        }
    });
}

function schoolShowSelectTaskModal(reportId)
{
    $('#modal-select-task').modal('show');
    $('#chooseReportId').html(reportId);
}

function confirmAssociate(report) {
    $.ajax({
        url: '/reports/index/confirm/' + report,
        type: 'GET',
        cache: false,
        success: function (data) {
            try {
                if (!JSON.parse(data).error) {
                    window.location.reload();
                } else {
                    alert('Произошла ошибка');
                }
            } catch (e) {
            }
        },
        error: function () {
            alert('Произошла ошибка');
        }
    });
}
function rejectAssociate(report) {
    $.ajax({
        url: '/reports/index/reject/' + report,
        type: 'GET',
        cache: false,
        success: function (data) {
            try {
                if (!JSON.parse(data).error) {
                    window.location.reload();
                } else {
                    alert('Произошла ошибка');
                }
            } catch (e) {
            }
        },
        error: function () {
            alert('Произошла ошибка');
        }
    });
}
function applyReport(report) {
    $.ajax({
        url: '/reports/index/apply/' + report,
        type: 'GET',
        cache: false,
        success: function (data) {
            try {
                if (!JSON.parse(data).error) {
                    window.location.reload();
                } else {
                    alert('Произошла ошибка');
                }
            } catch (e) {
            }
        },
        error: function () {
            alert('Произошла ошибка');
        }
    });
}

function confirmDelete(report) {
    $.ajax({
        url: '/reports/index/confirm_delete_report/' + report,
        type: 'GET',
        cache: false,
        success: function (data) {
            try {
                var json = JSON.parse(data);
                if (json.error == false) {
                    window.location.reload();
                } else {
                    alert('Произошла ошибка');
                }
            } catch (e) {
            }
        }
    });
}
function cancelDelete(report) {
    $.ajax({
        url: '/reports/index/cancel_delete_report/' + report,
        type: 'GET',
        cache: false,
        success: function (data) {
            try {
                var json = JSON.parse(data);
                if (json.error == false) {
                    window.location.reload();
                } else {
                    alert('Произошла ошибка');
                }
            } catch (e) {
            }
        }
    });
}