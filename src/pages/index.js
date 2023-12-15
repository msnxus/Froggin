import MENU from './menu.html';
import DEATH from './death.html';
import SCORE from './score.html';

import styles from './styles.css';
import { AudioLoader, Audio, AudioListener } from 'three';

// initialize menu
export function init_pages(window, document) {
    // ------------------ APPEND PAGES ------------------
    // append menu
    let menu = document.createElement('div');
    menu.innerHTML = MENU;
    document.body.appendChild(menu);

    let death = document.createElement('div');
    death.innerHTML = DEATH;
    death.style.visibility = 'hidden';
    document.body.appendChild(death);


    let score = document.createElement('div');
    score.innerHTML = SCORE;
    document.body.appendChild(score);
    document.getElementById('hi-score-content').innerText = localStorage.getItem('high-score', 0);

    // append styles
    let style = document.createElement('style');
    style.innerHTML = styles;
    document.head.appendChild(style);

    // --------------------------------------------------

    let count = 0; // increment count on every p press but only play music when count is 0.
    // event listener for page change
    window.addEventListener('keyup', (event) => {
        if (event.key == 'p') {
            let opac = document.getElementById('menu').style.opacity;
            document.getElementById('menu').style.opacity = opac == '' ? 0 : '';
            // audio
            const listener = new AudioListener();
            const sound = new Audio(listener);
            const audioLoader = new AudioLoader();
            if (count == 0) {
                audioLoader.load(
                    'https://raw.githubusercontent.com/msnxus/Froggin/main/src/sounds/music.mp3',
                    function (buffer) {
                        sound.setBuffer(buffer);
                        sound.setLoop(true);
                        sound.setVolume(0.2);
                        sound.play();
                    }
                );
            }
            count++;
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
