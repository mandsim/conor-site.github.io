function toggleMenu() {
    let uls =  document.querySelectorAll('.header-ul');
    uls.forEach(menu => {
        menu.classList.toggle('show');
    });
    let menuToogle = document.querySelectorAll('.menu-toggle');
    menuToogle.forEach(button => {
        button.classList.toggle('active');
    })
}