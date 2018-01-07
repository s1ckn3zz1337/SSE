$(function () {
    loadKeyRings();
    // Button actions
    $('.btn-load-private-key-proxy').click(function(){
        $('#keyringprivatekey').click();
    });
    $('.btn-decryptpassword').on('click', function () {
        decryptPasswords();
    });
    $('.btn-addkeyring').on('click', function () {
        openFrame('addkeyring');
    });
    $('.btn-addpassword').on('click', function () {
        openFrame('addpassword');
    });
    let form = $('.form-addkeyring');
    // Form bindings
    form.on('submit', function (e) {
        const keys = new JSEncrypt({default_key_size:2048});
        showLoader();
        // generate new key
        keys.getKey();
        hideLoader();
        const keyRingData = ConvertFormToJSON(form);
        keyRingData.publicKey = keys.getPublicKey();
        const privateKey = keys.getPrivateKey();
        $.post('/api/user/' + $.cookie('userid') + '/keyring', keyRingData, function (data) {
            let keyRingName = keyRingData.name;
            let element = document.createElement("a");
            element.setAttribute("download", keyRingName + ".pem");
            element.setAttribute("href", "data:application/octet-stream;base64," + btoa(privateKey));
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
        const formData = ConvertFormToJSON($('.form-addpassword'));
        const cryptor = new JSEncrypt();
        cryptor.setPublicKey(formData.publicKey);
        formData.password = cryptor.encrypt(formData.password);
        formData.publicKey = '';
        $.post('/api/user/' + $.cookie('userid') + '/keyring/' + currentKeyRingId + '/key', formData, function (response) {
        }).fail(function () {
            alert("Passwort konnte nicht angelegt werden.");
        }).always(function () {
            openFrame('passwords');
            loadKeyRings();
        });
        e.preventDefault();
    });

});

function ConvertFormToJSON(form){
    var array = jQuery(form).serializeArray();
    var json = {};

    jQuery.each(array, function() {
        json[this.name] = this.value || '';
    });

    return json;
}

var memory = {}

function loadKeyRings() {
    // Loading keyrings from API
    const keyrings = $('#keyrings');
   showLoader();
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

        keyrings.find('.keyring').on('click', function () {
            openKeyRing($(this));
        });
        hideLoader();
    });
}

function showLoader(){
    $('#keyrings').addClass('loading');
}

function hideLoader(){
    $('#keyrings').removeClass('loading');
}

var currentKeyRingId;

function decryptPasswords(){
    if($('#keyringprivatekey')[0].files.length > 0) {
        const r = new FileReader();
        r.onload = function(e) {
            const privateKey = e.target.result;
            const cryptor = new JSEncrypt();
            cryptor.setPrivateKey(privateKey);
            for(let i = 0; i < memory[currentKeyRingId].keyEntities.length; i++){
                let currentKey = memory[currentKeyRingId].keyEntities[i];
                currentKey.decryptedPassword = cryptor.decrypt(currentKey.keyEncryptedPassword);
            }
        };
        r.readAsText($('#keyringprivatekey')[0].files[0]);
    }else{
        alert('No file specified, cannot decrypt :(');
    }
}

function openKey(key) {
    // todo add page if there is a decrypted password, add it too
}

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