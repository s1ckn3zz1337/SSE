$(function() {
    var search = $('.form-search-user');

    search.on('submit', function (e) {
        $('#search-response').html('');
        const desiredUsername = convertFormToJSON(search).username;
        const query = {username: desiredUsername};
        $.post('/api/user', query, function (data) {
            console.log(data);

            for(var i = 0; i < data.length; i++) {
                $('#search-response').append('<tr>' +
                '<td>' + i+1 + '</td>' +
                '<td>' + data[i].username + '</td>' +
                '<td>' + data[i].id +'</td>' +
                '<td><div class="delete"></div></td>' +
                '</tr>');
            }
        }).fail(function () {
            alert('Fehler');
        });
        e.preventDefault();
    });
});

function convertFormToJSON(form){
    var array = jQuery(form).serializeArray();
    var json = {};

    jQuery.each(array, function() {
        json[this.name] = this.value || '';
    });

    return json;
}
