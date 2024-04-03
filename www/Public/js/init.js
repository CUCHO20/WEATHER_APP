function loadPartialView(viewName, divClass = null) {
    $.ajax({
        url: 'Views/' + viewName + '.html',
        method: 'GET',
        success: function (data) {
            $(divClass).html(data);
        },
        error: function (xhr, status, error) {
            console.error('Error al cargar la vista parcial:', error);
        }
    });
}

let idAqiLvl;
let idDelete;
let isChecked;

function setIdSugg(id) {
    idAqiLvl = id;
}

function setIdToDelete(id) {
    idDelete = id;
}