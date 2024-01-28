import { call as _call } from 'wasm-imagemagick';

export const call = (window as any).magick.call as typeof _call;
