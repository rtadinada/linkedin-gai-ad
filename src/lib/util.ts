export function range(end: number): number[] {
    return Array.from({ length: end }, (_, i) => i);
}

export function removeTabNewline(s: string): string {
    return s.replace(/[\n\t\xa0]/g, "");
}

export function removeDoubleQuotes(s: string) {
    return s.replace(/\"/g, "");
}
