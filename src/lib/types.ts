import type { NOTE_NAMES } from "./constants";

export type Chord =
    | "I"
    | "II"
    | "III"
    | "IV"
    | "V"
    | "VI"
    | "VII"
    | "i"
    | "ii"
    | "iii"
    | "iv"
    | "v"
    | "vi"
    | "vii";

export interface NoteFrequency {
    [key: string]: number;
}

export type NoteName = (typeof NOTE_NAMES)[number];
