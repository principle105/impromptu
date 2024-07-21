import { MAJOR_INTERVALS, MINOR_INTERVALS, NOTE_NAMES } from "./constants";
import type { NoteName } from "./types";

// SCALES
const generateScale = (key: NoteName, variant: "major" | "minor") => {
    const intervals = variant === "major" ? MAJOR_INTERVALS : MINOR_INTERVALS;

    const scale: NoteName[] = [];
    const startIndex = NOTE_NAMES.indexOf(key);

    let currentIndex = startIndex;

    for (const interval of intervals) {
        scale.push(NOTE_NAMES[currentIndex]);

        currentIndex = (currentIndex + interval) % NOTE_NAMES.length;
    }

    return scale;
};

// INTERVALS
export const generateIntervals = (key: NoteName) => {
    const majorScale = generateScale(key, "major");
    const minorScale = generateScale(key, "minor");

    return {
        I: [majorScale[0], majorScale[2], majorScale[4]],
        II: [majorScale[1], majorScale[3], majorScale[5]],
        III: [majorScale[2], majorScale[4], majorScale[6]],
        IV: [majorScale[3], majorScale[5], majorScale[0]],
        V: [majorScale[4], majorScale[6], majorScale[1]],
        VI: [majorScale[5], majorScale[0], majorScale[2]],
        VII: [majorScale[6], majorScale[1], majorScale[3]],

        i: [minorScale[0], minorScale[2], minorScale[4]],
        ii: [minorScale[1], minorScale[3], minorScale[5]],
        iii: [minorScale[2], minorScale[4], minorScale[6]],
        iv: [minorScale[3], minorScale[5], minorScale[0]],
        v: [minorScale[4], minorScale[6], minorScale[1]],
        vi: [minorScale[5], minorScale[0], minorScale[2]],
        vii: [minorScale[6], minorScale[1], minorScale[3]],
    };
};

export class Note {
    note: NoteName | "";
    octave: string;
    length: number;

    constructor(
        note: NoteName | "" = "C",
        octave: string = "3",
        length: number = 1,
    ) {
        this.note = note;
        this.octave = octave;
        this.length = length;
    }

    name = () => {
        return this.note + this.octave;
    };
}

export class Measure {
    notes: Note[];

    constructor(notes: Note[] = []) {
        this.notes = notes;
    }
}

export const generateEmptyMeasure = (noteLengths: number[]) => {
    const notes: Note[] = [];

    for (let i = 0; i < noteLengths.length; i++) {
        notes.push(new Note("", "", noteLengths[i]));
    }

    return notes;
};
