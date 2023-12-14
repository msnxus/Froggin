import { Group } from 'three';
import LillyPad from '../Lilly-Pad/LillyPad';
import { Scene } from 'three';
import SceneParams from '../../../params';

class LillyPadGenerator extends Group {
    constructor() {
        super();

        // Construct initial lilly pad nodes
        const firstPad = new LillyPad(undefined, 0);
        this.previous = [];
        this.current = firstPad;
        this.next = [];

        this.add(firstPad);
        this.initPads(SceneParams.NUM_INITIAL_PADS);
    }

    getPads() {
        console.log(this.previous.map((p) => p.index));
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

    reset() {
        this.next =
            this.current.index != 0
                ? [...this.previous.slice(1), this.current, ...this.next]
                : [...this.previous.slice(1), ...this.next];
        this.current =
            this.previous.length > 0 ? this.previous[0] : this.current;
        this.previous = [];
    }

    setNextLillyPad(newCurrent) {
        if (this.current !== newCurrent) {
            // Generate new pad at the end of the range
            const newNext = this.next[this.next.length - 1].generateNextPad();

            // Add current pad to previous as well as any skipped pads
            const delta = newCurrent.index - this.current.index;
            if (delta > 0) {
                this.previous.push(this.current);
                for (let i = 0; i < delta - 1; i++) {
                    this.previous.push(this.next[i]);
                }
            } else if (delta < 0) {
            }

            this.next.push(newNext);
            this.add(newNext);
        }
    }
}

export default LillyPadGenerator;
