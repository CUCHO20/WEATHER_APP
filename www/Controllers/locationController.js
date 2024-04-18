function saveLocationByCoords(locationData) {
    $.ajax({
        url: getLocations,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(locationData),
        success: function (response) {
            console.log('Localidad guardada exitosamente:', response);
            $('.show-alert-login').empty().append(`
            <div class="alert alert-dismissible text-light alert-success">
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert"></button>
                <strong>Localidad guardada exitosamente.</strong>
            </div>
            `);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("Error: " + textStatus + " - " + errorThrown);
        }
    });
}

function getLocationToUser(id) {
    $.ajax({
        url: getLocationByUser + id,
        method: 'GET',
        contentType: 'application/json',
        success: function (response) {
            console.log(response);
            setLocations(response);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("Error in get geocoding data: " + textStatus + " - " + errorThrown);
        }
    });
}

function removeLocation(id) {
    $.ajax({
        url: deleteLocation + id,
        method: 'DELETE',
        contentType: 'application/json',
        data: JSON.stringify({
            id_location: id
        }),
        success: function (response) {
            console.log('ñsñsñ');
            getLocationToUser(getUserIdLocalStorageValue());
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("Error in get geocoding data: " + textStatus + " - " + errorThrown);
        }
    });
}

function setLocations(response) {
    $('.list-locations').empty();
    response.forEach(element => {
        $('.list-locations').append(`
        <li class="item-search-list mb-3">
            <a data-bs-dismiss="offcanvas" onclick="initBySearch(${element.lat}, ${element.lon})">
                <div class="d-flex align-items-center justify-content-between">
                    
                    <div class="ps-2 d-flex align-items-center justify-content-center">
                        <i class="bi bi-geo-alt-fill" style="font-size: x-large;"></i>
                        
                        <div class="ms-3">
                            <p class="location-name m-0" style="font-size: 1rem;">${element.location1}</p>
                            <p class="location-StateCountry m-0" style="font-size: small;">${element.state_city}</p>
                        </div>
                    </div>
                    <div>
                        <a onclick="removeLocation(${parseInt(element.id_location)})" class="btn btn-danger p-2"><i class="bi bi-trash"></i></a>
                    </div>
                </div>
            </a>
        </li>
        `);
    });
}