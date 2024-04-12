/*
    • Solicitudes AJAX a la API REST:

        - getSuggestions(GET): Esta función llama a la API
          para llamar a una categoria de sugerencias en especifico. Pasa como parametro
          el número correspondiente a la foreign key (id_wstatus).

        - getSuggestionToPost(POST): Esta función llama a la API
          para registrar una sugerencia. Pasa como parametro
          los datos obtenidos de los inputs del formulario
          de Registrar sugerencia.

        - getAllSuggestions(GET): Esta función llama a la API
          para llamar a todas las sugerencias de cada una de
          las categorias.

        - deleteSuggestionById(PUT): Esta función llama a la API
          para una sugerencia de cierta categoria. Recibe por  
          parámetro el objeto con los nuevos datos y el id en
          su respectivo formato.
*/

function getSuggestions(aqiLvl) {
    $.ajax({
        url: byAqiSuggestions + aqiLvl,
        method: 'GET',
        contentType: 'application/json',
        success: function (response) {
            console.log(response);
            suggestionsData = response;
            setSuggestionsInfo(suggestionsData);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error:', textStatus, errorThrown);
        }
    });
}

function getSuggestionToPost(addSuggData) {
    $.ajax({
        url: addSuggestion,
        method: 'POST',
        data: JSON.stringify(addSuggData),
        contentType: 'application/json',
        success: function (response) {
            console.log('Sugerencia agregada con exito');
            removeModalSugg();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error:', textStatus, errorThrown);
        }
    });
}

function getAllSuggestions() {
    $.ajax({
        url: allSuggestions,
        method: 'GET',
        contentType: 'application/json',
        success: function (response) {
            console.log(response);
            allSuggestionsData = response;
            setAllSuggestionsInfo(allSuggestionsData);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error:', textStatus, errorThrown);
        }
    });
}

function deleteSuggestionById(id, deleteSuggData) {
    $.ajax({
        url: deleteSuggestion + id,
        method: 'DELETE',
        contentType: 'application/json',
        data: JSON.stringify(deleteSuggData),
        success: function (response) {
            console.log('Sugerencia eliminada con exito');
            removeModalSugg();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error:', textStatus, errorThrown);
        }
    });

}

function getSuggestionById(id) {
    $.ajax({
        url: getSpecificSuggestion + id,
        method: "GET",
        contentType: 'application/json',
        success: function (response) {
            console.log(response);
            putSuggToUpdate = response;
            setSpecificSuggestionsInfo(putSuggToUpdate);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error:', textStatus, errorThrown);
        }
    });
}

function getSuggestionToPut(updateSuggData, id) {
    $.ajax({
        url: updateSuggestion + id,
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(updateSuggData),
        success: function (response) {
            console.log('Sugerencia actualizada correctamente');
            removeModalSugg();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error:', textStatus, errorThrown);
        }
    });
}


/*
    • Funciones para el control de los datos las categorias y las vistas:

        - setAllSuggestionsInfo(): Muestra todas las
          sugerencias en la vista principal.
        
        - removeModalSugg(): Remueve los modales
          cuando hayan finalizado las acciones AJAX.

        - setSuggestionsInfo(): Enlista todas las sugerencias
          en la vista principal.
*/

function setSpecificSuggestionsInfo(putSuggToUpdate) {
    $('.suggestion .status .aqi-lvl .aqi-txt').empty();

    $('.aqi-txt').text(putSuggToUpdate.WStatu.level_txt);
    $('.aqi-lvl').text(putSuggToUpdate.WStatu.aqi_lvl);
    $('.suggestion').val(putSuggToUpdate.suggestion1);
    $('.status-to-put').prop('checked', putSuggToUpdate.status);
    $('.btn-update-id-sugg').attr('onclick', `clickToUpdateSugg(${putSuggToUpdate.id_suggestion})`);
}

function setAllSuggestionsInfo(allSuggestionsData) {
    $('.good-list-sugg, .regular-list-sugg, .moderate-list-sugg, .deficient-list-sugg, .sodeficient-list-sugg').empty();
    
    for (let i = 0; i < allSuggestionsData.length; i++) {
        const element = allSuggestionsData[i];
        
        $(`#put-input-${element.id_suggestion}`).removeClass();

        let html = `
        <div class="nav nav-pills d-flex align-items-center justify-content-between bg-light p-0 mb-3"
        style="height: auto;">
            <div class="row p-3 vw-100">
                <p class="m-0 col-10">
                    ${element.suggestion1}
                </p>
                <div class="col-2 d-flex flex-column gap-2 align-items-center justify-content-center">
                    <a onclick="setIdToDelete(${element.id_suggestion})" class="btn-delete-sugg bg-danger rounded px-2 py-1 d-flex align-items-center justify-content-center" data-bs-toggle="modal" data-bs-target="#exampleModal3"><i class="bi bi-trash text-light"></i></a>
                    <a onclick="getSuggestionById(${element.id_suggestion})" class="btn-update-sugg bg-warning rounded px-2 py-1 d-flex align-items-center justify-content-center" data-bs-toggle="modal"
                        data-bs-target="#exampleModal"><i class="bi bi-pencil text-light p-0"></i></a>
                </div>
            </div>

            <div class="mt-2 bg-info rounded-bottom col-12 p-2">
                <div id="put-input-${element.id_suggestion}" class="form-check form-switch">
                </div>
            </div>
        </div> 
        `;
        let classGood = `class-${element.id_suggestion}`;
        let inputGood = `input-check-${element.id_suggestion}`;
        let htmlGood = `
        <input id="${inputGood}" class="form-check-input" type="checkbox" role="switch" disabled>
        <p class="m-0 text-light">Mostrar sugerencia</p>               
        `;

        switch (element.WStatu.aqi_lvl) {
            case 1:
                $('.good-list-sugg').append(html);
                $(`#put-input-${element.id_suggestion}`).addClass(`form-check form-switch ${classGood}`);
                $(`.${classGood}`).empty().append(htmlGood);

                $(`#${inputGood}`).prop('checked', element.status);
                break;

            case 2:
                $('.regular-list-sugg').append(html);
                $(`#put-input-${element.id_suggestion}`).addClass(`form-check form-switch ${classGood}`);
                $(`.${classGood}`).empty().append(htmlGood);

                $(`#${inputGood}`).prop('checked', element.status);
                break;

            case 3:
                $('.moderate-list-sugg').append(html);
                $(`#put-input-${element.id_suggestion}`).addClass(`form-check form-switch ${classGood}`);
                $(`.${classGood}`).empty().append(htmlGood);

                $(`#${inputGood}`).prop('checked', element.status);
                break;

            case 4:
                $('.deficient-list-sugg').append(html);
                $(`#put-input-${element.id_suggestion}`).addClass(`form-check form-switch ${classGood}`);
                $(`.${classGood}`).empty().append(htmlGood);

                $(`#${inputGood}`).prop('checked', element.status);
                break;

            case 5:
                $('.sodeficient-list-sugg').append(html);
                $(`#put-input-${element.id_suggestion}`).addClass(`form-check form-switch ${classGood}`);
                $(`.${classGood}`).empty().append(htmlGood);

                $(`#${inputGood}`).prop('checked', element.status);
                break;
        }
    }
        
        $('.btn-update-sugg').click(function () {
            loadPartialView('Modules/modal-edit-sugg', editSuggRender);
        });
    
        $('.btn-delete-sugg').click(function () {
            loadPartialView('Modules/modal-delete-sugg', deleteSuggRender);
        });
}

function removeModalSugg() {
    $('.modal').removeClass('show');
    $('.modal-backdrop').removeClass();
    $('body').removeAttr('style');
    loadPartialView('suggest/edit-sugg', appRender);
}

function setSuggestionsInfo(suggestionsData) {
    $('#aqi-lvl .aqi-txt .aqi-list').empty();
    $('#aqi-lvl').removeClass().addClass('px-2 rounded text-white');

    $('#aqi-lvl').text(suggestionsData[0].WStatu.level_txt);
    $('.aqi-lvl').text(suggestionsData[0].WStatu.level_txt);
    $('#aqi-lvl').addClass(suggestionsData[0].WStatu.bgcolor);
    $('.aqi-txt').text(suggestionsData[0].WStatu.message);

    for (i = 0; i < suggestionsData.length; i++) {
        const element = suggestionsData[i];
        if (element.suggestion1 != '' && element.status === true) {
            let html = `
                <li class="m-0 p-2">${element.suggestion1}</li>
            `;
            $('.aqi-list').append(html);
        } else {
            let html = `
                <li class="m-0 p-2">No hay sugerencias.</li>
            `;
            $('.aqi-list').append(html);
        }
    }
}