export interface SerializedBlob {
    json: string;
}

export async function serializeBlob(blob: Blob): Promise<SerializedBlob> {
    const json = JSON.stringify({
        type: blob.type,
        size: blob.size,
        data: Array.from(new Uint8Array(await blob.arrayBuffer())),
    });
    return { json };
}
export async function deserializeBlob(s: SerializedBlob): Promise<Blob> {
    const { json } = s;
    const data = JSON.parse(json);
    return new Blob([new Uint8Array(data.data)], { type: data.type });
}
