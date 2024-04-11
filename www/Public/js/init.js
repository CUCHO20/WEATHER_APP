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

function btnSearch(action) {
    action === 'show'
        ? $('.btn-search').show()
        : $('.btn-search').hide();
}

function btnUser(action) {
    action === 'show'
        ? $('.btn-user').show()
        : $('.btn-user').hide();
}

function dropdownBtnUserOptions(option) {
    switch (option) {
        case 'login':
            $('.btn-login').show();
            $('.btn-register').hide();
            break;

        case 'register':
            $('.btn-login').hide();
            $('.btn-register').show();
            break;

        case 'show':
            $('.btn-register').show()
            $('.btn-login').show()
            break;

        default:
            $('.btn-register').hide();
            $('.btn-login').hide();
            break;
    }
}

function btnInfoUser(action) {
    action === 'show'
        ? $('.btn-info-user').show()
        : $('.btn-info-user').hide();
}

function dropdownBtnInfoUserOptions(action) {
    action === 'show'
        ? $('.btn-show-info .btn-remove-id').show()
        : $('.btn-show-info .btn-remove-id').hide();
}

var userLoginDataAlert
var classLoginDataAlert
var messageLoginDataAlert

function showAlertSuccess(response) {
    console.log(response.Message)
    classLoginDataAlert = response.Message_Classes;
    userLoginDataAlert = response.value.user_name;
    messageLoginDataAlert = response.Message;
}

// Variables y arreglos declarados y funciones con operaciones a utilizar
let weatherData

let map = null

const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const getTime = function (timeUnix, timezone) {
    const date = new Date((timeUnix + timezone) * 1000);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const period = hours >= 12 ? "PM" : "AM";

    return `${hours % 12 || 12}:${minutes} ${period}`;
}

const getHours = function (timeUnix, timezone) {
    const date = new Date((timeUnix + timezone) * 1000);
    const hours = date.getUTCHours();
    const period = hours >= 12 ? "PM" : "AM";

    return `${hours % 12 || 12} ${period}`;
}

const mps_to_kmh = mps => {
    const mph = mps * 3600;
    return mph / 1000;
}