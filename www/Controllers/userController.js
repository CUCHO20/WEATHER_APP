/*
    • Funciones para guardar, obtener y eliminar el ID de los usuarios
      dentro del LocalStorage.
*/

function saveUserIdLocalStorageValue(id_user, value) {
    return localStorage.setItem('id_user', value);
}

function getUserIdLocalStorageValue() {
    return localStorage.getItem('id_user');
}

function removeUserIdLocalStorageValue() {
    return localStorage.removeItem('id_user');
}

function saveUserRolIdLocalStorageValue(id_rol, value) {
    return localStorage.setItem('id_rol', value);
}

function getUserRolIdLocalStorageValue() {
    return localStorage.getItem('id_rol');
}

function removeUserRolIdLocalStorageValue() {
    return localStorage.removeItem('id_rol');
}



/*
    • Solicitudes AJAX a la API REST:

        - userRegister(POST): Esta función llama a la API
          para registrar un usuario. Pasa como parametro
          los datos obtenidos de los inputs del formulario
          de registro.

        - userLogin(POST): Esta función llama a la API
          para iniciar la sesión de un usuario. Pasa como parametro
          los datos obtenidos de los inputs del formulario
          de login.

        - getUserData(GET): Esta función llama a la API
          para mostrar los datos de un usuario. Pasa como parametro
          el ID almacenado en el Local Storage.

        - updateUserData(PUT): Esta función llama a la API
          para actualizar los datos de un usuario. Recibe por  
          parámetro el objeto con los nuevos datos y el token  
          que se encuentra guardado en el Local Storage.
*/

function userRegister(formData) {
    $.ajax({
        url: registerUser,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function (response) {
            console.log("Registro de usuario exitoso: ", response);
            loadPartialView('user/login', appRender);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("Error in registration: " + textStatus + " - " + errorThrown);
        }
    });
}

function userLogin(formLogin) {
    $.ajax({
        url: loginUser,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(formLogin),
        success: function (response) {
            if (response.Success == true) {
                loadPartialView('home/content', appRender);
                loadPartialView('Modules/alert-login-success', showAlertLoginSuccess);

                saveUserIdLocalStorageValue("id_user", response.value.id_user);
                saveUserRolIdLocalStorageValue("id_rol", response.value.id_rol);

                showAlertSuccess(response);
                showUserIcon(response.value.imagename);
                getUserData(parseInt(response.value.id_user));
            } else {
                $('.show-alert-login').empty().append(`
                <div class="alert alert-dismissible text-light ${response.Message_Classes}">
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert"></button>
                    <strong>${response.Message}</strong>
                </div>
                `);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("Error al iniciar sesión: " + textStatus + " - " + errorThrown);
        }
    });
}

function getUserData(id) {
    $.ajax({
        url: dataUser + id,
        method: 'GET',
        contentType: 'application/json',
        success: function (response) {
            setDataUser(response);
            setDataUserToPut(response);
            btnUser('hide');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error:', textStatus, errorThrown);
        }
    });
}

function updateUserData(updateData, id) {
    $.ajax({
        url: updateUser + id,
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(updateData),
        success: function (response) {
            console.log('Usuario actualizado exitosamente:', response);
            loadPartialView('home/content', appRender);
            btnInfoUser('show');
            btnSearch('show');
            getUserData(id);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error:', textStatus, errorThrown);
        }
    });
}


/*
    • Funciones para el control de los datos los usuarios y las vistas:

        - showUserIcon(): Muestra los iconos del perfil
          en función del rol del usuario.
        
        - setDataUser(): Muestra los datos del usuario
          en las secciones correspondientes.

        - setDataUserToPut(): Muestra los datos existentes
          del usuario como referencia a la hora de
          actualizarlos.
*/

function showUserIcon(img) { // Función para mostrar el icono correspondiente basado en el estado del usuario
    btnUser('hide');
    btnInfoUser('show');
    btnSearch('show');

    dropdownBtnInfoUserOptions('show');

    $('.user-icon-btn').removeClass().addClass(`user-icon-btn btn d-flex align-items-center justify-content-center ${img || "cat-one"}`);
}

function setDataUser(response) {
    $('.user-rol .user-name .user-email').empty();

    $('.user-rol').text(response.Rol.rol1);
    response.bgcolor != null ? $('.user-background').removeClass().addClass(`user-background position-relative p-5 mb-5 rounded-top ${response.bgcolor}`) : $('.user-background').removeClass().addClass('user-background position-relative p-5 mb-5 rounded-top bg-primary');
    response.imagename != null ? $('.user-img').removeClass().addClass(`user-img ${response.imagename}`) : $('.user-img').removeClass().addClass('user-img cat-one');
    $('.user-name').text(response.user_name);
    $('.user-email').text(response.email);

    $('.user-icon-btn').removeClass().addClass(`user-icon-btn btn d-flex align-items-center justify-content-center ${response.imagename}`);
}

function setDataUserToPut(response) {
    $('.user-rol .user-name-val .user-email-val .user-password-val').empty();

    $('.user-rol').val(response.Rol.rol1);
    response.imagename != null ? $('.img-cat-user').removeClass().addClass(`img-cat-user ${response.imagename}`) : $('.img-cat-user').removeClass().addClass('img-cat-user cat-one');
    response.bgcolor != null ? $('.bg-user').removeClass().addClass(`bg-color-chosen bg-user rounded ${response.bgcolor}`) : $('.bg-user').removeClass().addClass('bg-color-chosen bg-user rounded bg-primary');
    $('.user-name-val').val(response.user_name);
    $('.user-email-val').val(response.email);
    $('.user-password-val').val(response.password);

    bgcolor = response.bgcolor;
    imagename = response.imagename;
    user_name = $('.user-name-val').val();
    email = $('.user-email-val').val();
    password = $('.user-password-val').val();
    id = parseInt(getUserIdLocalStorageValue());
}