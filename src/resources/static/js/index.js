$(function () {

    var login = $('.form-signin');

    login.on('submit', function (e) {

        $.post('/api/login', login.serialize(), function (data) {
            alert(data);
            window.location.href = 'dashboard.html';
        }).fail(function () {
            alert('Fehler');
        });

        e.preventDefault();
    });

});