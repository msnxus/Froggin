import MENU from './menu.html';

// initialize menu
export function init_pages(document, menuCanvas) {
    document.body.innerHTML = MENU;
    document.body.appendChild(menuCanvas);
    // let menu = document.createElement('div');
    // // menu.id = 'menu';
    // // menu.innerHTML = MENU;
    // // document.body.appendChild(menu);
}

export function init_fonts(document) {
    // let titleFont = document.createElement('link');
    // titleFont.id = 'titleFont';
    // titleFont.rel = 'stylesheet';
    // titleFont.href = 'https://fonts.googleapis.com/css?family=Audiowide';
    // document.head.appendChild(titleFont);
    // let font = document.createElement('link');
    // font.id = 'font';
    // font.rel = 'stylesheet';
    // font.href = 'https://fonts.googleapis.com/css?family=Radio+Canada';
    // document.head.appendChild(font);
}