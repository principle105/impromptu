import * as Tone from 'tone';

export default function sampler() {
  return new Tone.Synth({
  }).toDestination();
}