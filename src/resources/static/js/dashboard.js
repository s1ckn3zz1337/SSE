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
            let filename = keyRingData.name + ".pem";
            let element = document.createElement("a");
            console.dir(element);
            console.log(element.download);
            console.log(element.download == undefined);
            if(element.download !== undefined){
                element.setAttribute("download", filename);
                element.setAttribute("href", "data:application/octet-stream;base64," + btoa(privateKey));
                console.log("Click");
                element.click();
            }else if(window.Blob && window.navigator.msSaveOrOpenBlob){
                let blob = new Blob([privateKey]);
                window.navigator.msSaveBlob(blob, filename);
            }else{
                //addPrivateKeyHtml(privateKey);
            }
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

function addPrivateKeyHtml(privateKey) {
    let wrapper = document.createElement("div");
    wrapper.textContent = "Your browser does not support the download, please save the privateKey into a file yourself";
    wrapper.className = "center-container";
    
    let removeButton = document.createElement("input");
    removeButton.type = "button";
    removeButton.className = "btn btn-lg btn-primary btn-block remove-workaround";
    removeButton.textContent = "Remove me!";
    removeButton.onclick = function(){
        wrapper.remove();
    }
    
    let privateKeyDiv = document.createElement("div");
    privateKeyDiv.className = 'generated-private-key';
    privateKeyDiv.textContent = privateKey;

    privateKeyDiv.appendChild(removeButton);
    wrapper.appendChild(privateKeyDiv);
}

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
        //keyrings.append('<div class="keyring" ref="666">Testring</div>');

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

const passwordDisplay = "password-display";
const showHide = "show-hide";

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
}

function addShowHideHandlers(){
    $('.' + showHide).change(function () {
        let $display = $("." + passwordDisplay + "[ref='" + $(this).attr('ref') + "']");
        if ($(this).is(":checked")) {
            $display.attr('type', 'text');
        } else {
            $display.attr('type', 'password');
        }
    });
}

function addDecryptedPasswordField(keyId, decryptedPassword) {
    const pwDiv = $(".password[ref=" + keyId + "]");
    pwDiv.after("<input type='password' class='" + passwordDisplay + "' ref='" + keyId + "' value='" + decryptedPassword + "'></input>" +
        "<input type='checkbox' class='show-hide' ref='" + keyId + "' name='show-hide' value='' />");
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
    passwords.html('');

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