$(function () {

    loadKeyRings();
    // Button actions
    $('.btn-addkeyring').on('click', function () { openFrame('addkeyring'); });
    $('.btn-addpassword').on('click', function () { openFrame('addpassword'); });
    let form = $('.form-addkeyring');
    // Form bindings
    form.on('submit', function (e) {

        $.post('/api/user/' + $.cookie('userid') + '/keyring', form.serialize(), function (data) {
            let keyRingName = form.serialize().split("&")[0].split("=")[1];
            let element = document.createElement("a");
            element.setAttribute("download", keyRingName + ".pem");
            element.setAttribute("href", "data:application/octet-stream;base64," + btoa(data));
            element.click();
        }).fail(function () {
            alert("Schlüsselbund konnte nicht angelegt werden.");
        }).always(function () {
            openFrame('keyrings');
            loadKeyRings();
        });

        e.preventDefault();
    });
    $('.form-addpassword').on('submit', function (e) {
        $.post('/api/user/' + $.cookie('userid') + '/keyring/' + currentKeyRingId + '/key', $('.form-addpassword').serialize(), function (data) {
        }).fail(function () {
            alert("Passwort konnte nicht angelegt werden.");
        }).always(function () {
            openFrame('passwords');
            loadKeyRings();
        });
        e.preventDefault();
    });

});

var memory = {}

function loadKeyRings() {
    // Loading keyrings from API
    let keyrings = $('#keyrings');
    keyrings.addClass("loading");
    keyrings.html('');

    $.get('/api/user/' + $.cookie('userid') + '/keyring', function (keyringData) {
        if (keyringData.length == 0)
            keyrings.append('<div class="warning">Kein Schlüsselbund angelegt.</div>');
        else {
            for (var i = 0; i < keyringData.length; i++) {
                keyrings.append('<div class="keyring" ref="' + keyringData[i].id + '">' + keyringData[i].name + '</div>');
                memory[keyringData[i].id] = keyringData[i];
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

var currentKeyRingId;

function openKeyRing(keyring) {
    // Open a specific keyring
    var name = keyring.text();
    currentKeyRingId = keyring.attr("ref");

    $('#keyringname').text(name);
    $('#input-idkeyring').val(currentKeyRingId);
    $('#input-public-key').val(memory[currentKeyRingId].publicKey);

    var passwords = $('#passwords');

    $.get('/api/user/' + $.cookie('userid') + '/keyring/' + currentKeyRingId, function (ring) {
        let passwds = ring.keyEntities;
        if (passwds.length == 0)
            passwords.append('<div class="warning">Kein Passwort angelegt.</div>');
        else {
            for (var i = 0; i < passwds.length; i++) {
                passwords.append('<div class="password" ref="' + passwds[i].id + '">' + passwds[i].keyName + '</div>');
            }
        }

    }, 'JSON').fail(function () {
        passwords.append('<div class="warning">Fehler beim Laden der Passwörter.</div>');
    }).always(function () {
    });

    openFrame('keyring');
}

function openFrame(name) {
    $('.frame').removeClass('open');
    $('.frame.' + name).addClass('open');
}