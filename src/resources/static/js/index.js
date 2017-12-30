$(function () {

    var login = $('.form-signin');

    login.on('submit', function (e) {

        $.post('/login', login.serialize(), function (data) {
            alert(data);
        }).fail(function () {
            alert('Fehler');
        });

        e.preventDefault();
    });

});