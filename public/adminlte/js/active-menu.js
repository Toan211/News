$(document).ready(function () {
    let pathname = window.location.pathname;
    let arrMenu = pathname.split("/");
    let currentMenu = arrMenu[2];
    $('li.nav-item a[data-active="'+currentMenu+'"]').addClass('active');
});