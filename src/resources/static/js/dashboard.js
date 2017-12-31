$(function () {

    loadKeyRings();

    // Button actions
    $('.btn-addkeyring').on('click', function () { openFrame('addkeyring'); });

    // Form bindings
    $('.form-addkeyring').on('submit', function (e) {

        $.post('/api/keyring', $('.form-addkeyring').serialize(), function (data) {
            /* TODO Get Certificate*/
        }).fail(function () {
            alert("Schlüsselbund konnte nicht angelegt werden.");
        }).always(function () {
           openFrame('keyrings');
           loadKeyRings();
        });

        e.preventDefault();
    });

});

function loadKeyRings()
{
    // Loading keyrings from API
    var keyrings = $('#keyrings');
    keyrings.addClass("loading");
    keyrings.html('');

    $.get('/api/keyrings', function (keyrings) {

        if (keyrings.length == 0)
            keyrings.append('<div class="warning">Kein Schlüsselbund angelegt.</div>');
        else
        {
            for (var i = 0; i < keyrings.length; i++)
            {
                keyrings.append('<div class="keyring">'+keyrings[i].name+'</div>');
            }
        }

        keyrings.find('.keyring').on('click', function () { openKeyRing($(this)); });

        keyrings.removeClass("loading");
    }, 'JSON').fail(function () {
        keyrings.append('<div class="warning">Fehler beim Laden der Schlüsselbünde.</div>');
        keyrings.removeClass("loading");
    });
}

function openKeyRing()
{
    // Open a specific keyring

}

function openFrame(name)
{
    $('.frame').removeClass('open');
    $('.frame.'+name).addClass('open');
}