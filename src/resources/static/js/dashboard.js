$(function () {
    loadKeyRings();
    // Button actions
    $('.btn-decryptpassword').on('click', function () {
        decryptPasswords();
    });
    $('.btn-addkeyring').on('click', function () {
        openFrame('addkeyring');
    });
    $('.btn-addpassword').on('click', function () {
        openFrame('addpassword');
    });
    // Form bindings
    let formAddKeyring = $('.form-addkeyring');
    formAddKeyring.on('submit', function (e) {
        formAddKeyring.find("button").attr('disabled', true); // Button deaktivieren
        const keys = new JSEncrypt({ default_key_size: 2048 });
        showLoader();
        // generate new key
        keys.getKey();
        hideLoader();
        const keyRingData = ConvertFormToJSON(formAddKeyring);
        keyRingData.publicKey = keys.getPublicKey();
        const privateKey = keys.getPrivateKey();
        $.post('/api/user/' + $.cookie('userid') + '/keyring', keyRingData, function (data) {
            let filename = keyRingData.name + ".pem";
            let element = document.createElement("a");
            if (element.download !== undefined) {
                element.setAttribute("download", filename);
                element.setAttribute("href", "data:application/octet-stream;base64," + btoa(privateKey));
                document.documentElement.appendChild(element);
                element.onclick = function(){
                    element.remove();
                }
                element.click();
                formAddKeyring[0].reset();
            } else if (window.Blob && window.navigator.msSaveOrOpenBlob) {
                let blob = new Blob([privateKey]);
                window.navigator.msSaveBlob(blob, filename);
            } else {
                window.alert("Unsupported browser version");
            }
        }).fail(function () {
            alert("Schlüsselbund konnte nicht angelegt werden.");
        }).always(function () {
            openFrame('keyrings');
            loadKeyRings();
            formAddKeyring.find("button").attr('disabled', false); // Button aktivieren
        });

        e.preventDefault();
    });
    let formAddPassword = $('.form-addpassword');
    formAddPassword.on('submit', function (e) {
        formAddPassword.find("button").attr('disabled', true); // Button deaktivieren
        const formData = ConvertFormToJSON(formAddPassword);
        const cryptor = new JSEncrypt();
        cryptor.setPublicKey(formData.publicKey);
        formData.password = cryptor.encrypt(formData.password);
        formData.publicKey = '';
        $.post('/api/user/' + $.cookie('userid') + '/keyring/' + currentKeyRingId + '/key', formData, function (response) {
            formAddPassword.find('input[type=text],textarea').val('');
        }).fail(function () {
            alert("Passwort konnte nicht angelegt werden.");
        }).always(function () {
            //openFrame('keyring');
            openKeyRing(currentKeyRingId);
            formAddPassword.find("button").attr('disabled', false); // Button aktivieren
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
                keyrings.append('<div class="keyring" ref="' + keyringData[i].id + '" title="' + keyringData[i].description + '">' + keyringData[i].name + ' <div class="delete"></div></div>');
                memory[keyringData[i].id] = keyringData[i];
            }
        }

    }, 'JSON').fail(function () {
        keyrings.append('<div class="warning">Fehler beim Laden der Schlüsselbünde.</div>');
    }).always(function () {

        // Test
        //keyrings.append('<div class="keyring" ref="666">Testring</div>');

        keyrings.find('.keyring .delete').on('click', function (e) {
            deleteKeyRing($(this).parent());
            e.stopPropagation();
        });
        keyrings.find('.keyring').on('click', function () {
            openKeyRing($(this).attr('ref'));
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

const passwordDisplay = `password-display`;
const showHide = `show-hide`;
/** Not longer needed
function decryptPasswords(){
    const fileInput = document.getElementById("keyringprivatekey");
    fileInput.addEventListener('change', function(fileOpenEvent){
        const files = fileOpenEvent.target.files;
        if(files.length > 0) {
            if(files.length > 1){
                alert("Only the first of the selected files will be used as your private key");
            }
            const r = new FileReader();
            r.onload = function (fileLoadEvent) {
                const privateKey = fileLoadEvent.target.result;
                const cryptor = new JSEncrypt();
                cryptor.setPrivateKey(privateKey);
                for (let i = 0; i < memory[currentKeyRingId].keyEntities.length; i++) {
                    let currentKey = memory[currentKeyRingId].keyEntities[i];
                    currentKey.decryptedPassword = cryptor.decrypt(currentKey.keyEncryptedPassword);
                    addDecryptedPasswordField(currentKey.id, currentKey.decryptedPassword);
                }
                addShowHideHandlers();
            };
            r.readAsText($('#keyringprivatekey')[0].files[0]);
        }else{
            alert('No file specified, cannot decrypt :(');
        }
    }, false);
    fileInput.click();
}**/

// Decrypt single Password
function decryptPassword(encrypted){
    $('#keyringprivatekey').remove();
    $('body').append('<input id="keyringprivatekey" style="display:none" type="file" accept=".pem">');
    const fileInput = document.getElementById("keyringprivatekey");
    fileInput.addEventListener('change', function(fileOpenEvent){
        const files = fileOpenEvent.target.files;
        if(files.length > 0) {
            if(files.length > 1){
                alert("Only the first of the selected files will be used as your private key");
            }
            const r = new FileReader();
            r.onload = function (fileLoadEvent) {
                const privateKey = fileLoadEvent.target.result;
                const cryptor = new JSEncrypt();
                cryptor.setPrivateKey(privateKey);
                var decrypt = cryptor.decrypt(encrypted);
                $('#keyPassword').val(decrypt).attr('type', 'text');
            };
            r.readAsText($('#keyringprivatekey')[0].files[0]);
        }else{
            alert('No file specified, cannot decrypt :(');
        }
    }, false);
    fileInput.click();
}

function addShowHideHandlers(){
    $('.' + showHide).change(function () {
        let $display = $(`.` + passwordDisplay + `[ref='` + $(this).attr('ref') + `']`);
        if ($(this).is(":checked")) {
            $display.attr('type', 'text');
        } else {
            $display.attr('type', 'password');
        }
    });
}

function addDecryptedPasswordField(keyId, decryptedPassword) {
    const pwDiv = $(".password[ref=" + keyId + "]");
    pwDiv.after(`<input type='password' class='`+ passwordDisplay + `' ref='` + keyId + `' value='` + decryptedPassword + `'></input>
                 <input type="checkbox" class="show-hide" ref='`+ keyId + `' name="show-hide" value="" />`);
}

var currentKey = null;

function openPassword(key) {
    $.get('/api/user/' + $.cookie('userid') + '/keyring/'+currentKeyRingId+'/key/'+key, function (data) {
        console.log(data);

        $('#keyName').text(data.keyName);
        $('#keyUsername').val(data.keyUsername);
        $('#keyDescription').text(data.keyDescription);
        $('#keyWebsite').text(data.keyURL).attr('href', data.keyURL);
        $('#keyPassword').val('passwordpassword').attr('type', 'password');
        currentKey = data;

        $('.btn-decrypt').unbind().on('click', function () {
            decryptPassword(currentKey.keyEncryptedPassword);
        });

        openFrame('password');
    }, 'JSON').fail(function () {
        alert("Passwort konnte nicht geladen werden");
    });
}

function openKeyRing(idkeyring) {
    // Open a specific keyring
    currentKeyRingId = idkeyring;

    $('#keyringname').text($('.keyring[ref='+idkeyring+']').text());

    $('#input-idkeyring').val(currentKeyRingId);
    $('#input-public-key').val(memory[currentKeyRingId].publicKey);

    var passwords = $('#passwords');
    passwords.html('');

    $.get('/api/user/' + $.cookie('userid') + '/keyring/' + currentKeyRingId, function (ring) {
        let passwds = ring.keyEntities;
        if (passwds.length == 0)
            passwords.append('<div class="warning">Kein Passwort angelegt.</div>');
        else {
            for (var i = 0; i < passwds.length; i++) {
                passwords.append('<div class="password" ref="' + passwds[i].id + '">' + passwds[i].keyName + ' <div class="delete"></div></div>');
            }
        }

    }, 'JSON').fail(function () {
        passwords.append('<div class="warning">Fehler beim Laden der Passwörter.</div>');
    }).always(function () {
        passwords.find('.password .delete').on('click', function (e) {
            deletePassword($(this).parent());
            e.stopPropagation();
        });
        passwords.find('.password').on('click', function () {
            openPassword($(this).attr("ref"));
        });
    });

    openFrame('keyring');
}

function deleteKeyRing(keyring)
{
    var name = keyring.text();
    var idkeyring = keyring.attr("ref");

    sendApiDelete('/api/user/' + $.cookie('userid') + '/keyring/'+idkeyring, function () { keyring.remove(); }, 'Fehler beim Löschen des Schlüsselbunds '+name+'!');
}

function deletePassword(password)
{
    var name = password.text();
    var idpassword = password.attr("ref");

    sendApiDelete('/api/user/' + $.cookie('userid') + '/keyring/'+currentKeyRingId+'/key/'+idpassword, function () { password.remove(); }, 'Fehler beim Löschen des Passworts '+name+'!');
}

function sendApiDelete(url, successCallback, failMessage)
{
    $.ajax({
        url: url,
        type: 'DELETE',
        success: function(result) {
            successCallback();
        },
        error: function (result) {
            alert(failMessage);
            //@DEBUG
            console.log(result);
        }
    });
}

function openFrame(name) {
    $('.frame').removeClass('open');
    $('.frame.' + name).addClass('open');
}