$(function() {
    var search = $('.form-search-user');

    search.on('submit', function (e) {
        $('#search-response').html('');
        $.post('/api/user', search.serialize(), function (data) {
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