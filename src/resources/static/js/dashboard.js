var userUrl = '/api/user/' + $.cookie('userid');
$(function () {

    loadKeyRings();

    // Button actions
    $('.btn-addkeyring').on('click', function () { openFrame('addkeyring'); });
    $('.btn-addpassword').on('click', function () { openFrame('addpassword'); });

    // Form bindings
    $('.form-addkeyring').on('submit', function (e) {

        $.post(userUrl + '/keyring', $('.form-addkeyring').serialize(), function (data) {
            /* TODO Get Certificate*/
        }).fail(function () {
            alert("Schlüsselbund konnte nicht angelegt werden.");
        }).always(function () {
            openFrame('keyrings');
            loadKeyRings();
        });

        e.preventDefault();
    });
    $('.form-addpassword').on('submit', function (e) {

        $.post('/api/password', $('.form-addpassword').serialize(), function (data) {
            /* TODO Get Certificate*/
        }).fail(function () {
            alert("Passwort konnte nicht angelegt werden.");
        }).always(function () {
            openFrame('passwords');
            loadKeyRings();
        });

        e.preventDefault();
    });

});

var currentIdKeyRing = null;

function loadKeyRings()
{
    // Loading keyrings from API
    var keyrings = $('#keyrings');
    keyrings.addClass("loading");
    keyrings.html('');

    $.get(userUrl +  '/keyring', function (keyringData) {

        if (keyringData.length == 0)
            keyrings.append('<div class="warning">Kein Schlüsselbund angelegt.</div>');
        else
        {
            for (var i = 0; i < keyringData.length; i++)
            {
                keyrings.append('<div class="keyring" ref="'+keyringData[i].idkeyring+'">'+keyringData[i].name+'</div>');
            }
        }

    }, 'JSON').fail(function () {
        keyrings.append('<div class="warning">Fehler beim Laden der Schlüsselbünde.</div>');
    }).always(function () {

        // Test
        keyrings.append('<div class="keyring" ref="666">Testring</div>');

        keyrings.find('.keyring').on('click', function () { openKeyRing($(this)); });
        keyrings.removeClass("loading");
    });
}

function openKeyRing(keyring)
{
    // Open a specific keyring
    var name = keyring.text();
    var idkeyring = keyring.attr("ref");
    currentIdKeyRing = idkeyring;

    $('#keyringname').text(name);
    $('#input-idkeyring').val(idkeyring);

    var passwords = $('#passwords');

    $.get(userUrl + '/keying/'+idkeyring, function(passwds) {

        if (passwds.length == 0)
            passwords.append('<div class="warning">Kein Passwort angelegt.</div>');
        else
        {
            for (var i = 0; i < passwds.length; i++)
            {
                passwds.append('<div class="password" ref="'+passwds[i].idpassword+'">'+passwds[i].name+'</div>');
            }
        }

    },'JSON').fail(function () {
        passwords.append('<div class="warning">Fehler beim Laden der Passwörter.</div>');
    }).always(function () {
    });

    openFrame('keyring');
}

function openFrame(name)
{
    $('.frame').removeClass('open');
    $('.frame.'+name).addClass('open');
}