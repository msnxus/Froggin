import MENU from './menu.html';
import DEATH from './death.html';
import styles from './styles.css';

// initialize menu
export function init_pages(window, document) {
    // ------------------ APPEND PAGES ------------------
    // append menu
    let menu = document.createElement('div');
    menu.innerHTML = MENU;
    document.body.appendChild(menu);

    let death = document.createElement('div');
    death.innerHTML = DEATH;
    document.body.appendChild(death);

    // append styles
    let style = document.createElement('style');
    style.innerHTML = styles;
    document.head.appendChild(style);

    // --------------------------------------------------

    // event listener for page change
    window.addEventListener('keyup', (event) => {
        if (event.key == 'p') {
            let opac = document.getElementById('menu').style.opacity;
            document.getElementById('menu').style.opacity = opac == '' ? 0 : '';
        }
    });
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
