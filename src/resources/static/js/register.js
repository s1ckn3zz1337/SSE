$(function () {

    var register = $('.form-signin');

    register.on('submit', function (e) {

        if (register.find("#inputPassword").val() == register.find("#inputPassword2").val())
        {
            $.post('/register', register.serialize(), function (data) {
                alert(data);
                window.location.href = 'login.html';
            }).fail(function () {
                alert('Fehler');
            });
        }
        else
        {
            alert("Eingegebene Passwoerter stimmen nicht ueberein");
        }

        e.preventDefault();
    });

});