import { Group } from 'three';
import LillyPad from '../Lilly-Pad/LillyPad';
import { Scene } from 'three';

class LillyPadGenerator extends Group {
    constructor() {
        super();

        // Construct initial lilly pad nodes
        const firstPad = new LillyPad((index = 0));
        this.previous = [];
        this.current = firstPad;
        this.next = [];

        this.add(firstPad);
        this.initPads(2);
    }

    getPads() {
        return [...this.previous, this.current, ...this.next];
    }

    initPads(amount) {
        let curr = this.current;
        for (let i = 0; i < amount; i++) {
            const next = curr.generateNextPad();
            curr = next;
            this.next.push(next);
            this.add(next);
        }
    }

    setNextLillyPad() {
        const newNext = this.next[this.next.length - 1].generateNextPad();
        this.previous.push(this.current);
        this.current = this.next[0];
        this.next.push(newNext);
        this.add(newNext);
    }
}

export default LillyPadGenerator;
