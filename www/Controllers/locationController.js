function saveLocationByCoords(locationData) {
    $.ajax({
        url: getLocations,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(locationData),
        success: function(response) {
            console.log('Localidad guardada exitosamente:', response);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("Error in get geocoding data: " + textStatus + " - " + errorThrown);
        }
    });
}
