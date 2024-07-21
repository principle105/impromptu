import type { Chord, NoteFrequency } from "./types";
import { Note } from "./notes";

export const MAJOR_TRIADS_MAP = {
    C: ["C3", "E3", "G3"],
    "C#": ["C#3", "F3", "G#3"],
    D: ["D3", "F#3", "A3"],
    "D#": ["D#3", "G3", "A#3"],
    E: ["E3", "G#3", "B3"],
    F: ["F3", "A3", "C4"],
    "F#": ["F#3", "A#3", "C#4"],
    G: ["G3", "B3", "D4"],
    "G#": ["G#3", "C4", "D#4"],
    A: ["A3", "C#4", "E4"],
    "A#": ["A#3", "D4", "F4"],
    B: ["B3", "D#4", "F#4"],

    C3: ["C3", "E3", "G3"],
    "C#3": ["C#3", "F3", "G#3"],
    D3: ["D3", "F#3", "A3"],
    "D#3": ["D#3", "G3", "A#3"],
    E3: ["E3", "G#3", "B3"],
    F3: ["F3", "A3", "C4"],
    "F#3": ["F#3", "A#3", "C#4"],
    G3: ["G3", "B3", "D4"],
    "G#3": ["G#3", "C4", "D#4"],
    A3: ["A3", "C#4", "E4"],
    "A#3": ["A#3", "D4", "F4"],
    B3: ["B3", "D#4", "F#4"],

    C4: ["C4", "E4", "G4"],
    "C#4": ["C#4", "F4", "G#4"],
    D4: ["D4", "F#4", "A4"],
    "D#4": ["D#4", "G4", "A#4"],
    E4: ["E4", "G#4", "B4"],
    F4: ["F4", "A4", "C5"],
    "F#4": ["F#4", "A#4", "C#5"],
    G4: ["G4", "B4", "D5"],
    "G#4": ["G#4", "C5", "D#5"],
    A4: ["A4", "C#5", "E5"],
    "A#4": ["A#4", "D5", "F5"],
    B4: ["B4", "D#5", "F#5"],
} as const;

export const NOTE_NAMES = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
] as const;

export const MAJOR_INTERVALS = [2, 2, 1, 2, 2, 2, 1]; // Whole, Whole, Half, Whole, Whole, Whole, Half
export const MINOR_INTERVALS = [2, 1, 2, 2, 1, 2, 2]; // Whole, Half, Whole, Whole, Half, Whole, Whole

export const NOTE_FREQUENCY_MAP: NoteFrequency = {
    C3: 130.81,
    "C#3": 138.59,
    D3: 146.83,
    "D#3": 155.56,
    E3: 164.81,
    F3: 174.61,
    "F#3": 185.0,
    G3: 196.0,
    "G#3": 207.65,
    A3: 220.0,
    "A#3": 233.08,
    B3: 246.94,
    C4: 261.63,
    "C#4": 277.18,
    D4: 293.66,
    "D#4": 311.13,
    E4: 329.63,
    F4: 349.23,
    "F#4": 369.99,
    G4: 392.0,
    "G#4": 415.3,
    A4: 440.0,
    "A#4": 466.16,
    B4: 493.88,
    C5: 523.25,
};

// CADENCES
export const DOMINANT_CADENCE: Chord[] = ["V", "I"];

// PROGRESSION SNIPPETS
export const POSSIBLE_PROGRESSIONS: Chord[][] = [
    ["I", "IV", "I", "I", "IV", "IV", "I", "I", "V", "IV", "I"],
    ["I", "IV", "I", "I", "IV", "IV", "I", "I", "V", "IV"],
    ["I", "IV", "IV", "I", "IV", "IV", "I", "I", "V", "V"],
    ["I", "I", "I", "I", "IV", "IV", "I", "I", "V", "IV"],
    ["I", "IV", "I", "V", "IV", "IV", "I", "I", "V", "IV"],
    ["I", "I", "IV", "IV", "I", "I", "I", "IV", "V", "IV"],
    ["I", "IV", "I", "I", "IV", "IV", "I", "V", "I", "IV"],
    ["I", "IV", "I", "I", "IV", "I", "I", "IV", "V", "IV"],
    ["I", "IV", "I", "IV", "I", "IV", "I", "I", "V", "IV"],
    ["I", "I", "IV", "I", "IV", "IV", "I", "I", "V", "IV"],
];
