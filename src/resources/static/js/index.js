$(function () {
    var login = $('.form-signin');

    login.on('submit', function (e) {

        $.post('/api/login', login.serialize(), function (data) {

            console.log('Successful login for ' + data.username);
            $.cookie("userid", data.id);
            window.location.href = 'dashboard.html';
        }).fail(function () {
            alert('Fehler');
        });

        e.preventDefault();
    });

});