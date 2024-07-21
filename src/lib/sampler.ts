import * as Tone from "tone";

const sampler = () => {
    return new Tone.PolySynth({}).toDestination();
};

export default sampler;
