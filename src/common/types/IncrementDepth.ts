
export type IncrementDepth<Depth extends number> = [...Array<Depth>, unknown]['length'];
