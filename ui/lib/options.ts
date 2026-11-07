export const OPTIONS = {
  size: ["diminuto", "pequeño", "mediano", "grande", "enorme", "gigante"],
  diff: ["fácil", "medio", "difícil"],
  mtype: [
    "neo mediterráneo",
    "mediterráneo",
    "llanuras",
    "montañoso",
    "islas pequeñas",
    "islas grandes",
    "perfect islands",
  ],
  game: ["2v2", "3v3", "2v2v2", "3v3v3", "4v4", "5v5", "2v2v2v2", "2v1v1v1v1v1v1v1v1"],
} as const;

export type Group = keyof typeof OPTIONS;
