export function range(end: number): number[] {
    return Array.from({ length: end }, (_, i) => i);
}
