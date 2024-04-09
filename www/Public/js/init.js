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

function showAlertSuccess(response) {
    $('.alert-login-class-success').addClass(response.Message_Classes);
    $('.user-login').text(response.value.user_name);
    $('.user-message').text(response.Message);
}