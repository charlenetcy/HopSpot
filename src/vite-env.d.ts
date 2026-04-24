/// <reference types="vite/client" />

declare module "@mapbox/polyline" {
  interface PolylineModule {
    decode(encoded: string, precision?: number): [number, number][];
  }

  const polyline: PolylineModule;
  export default polyline;
}
