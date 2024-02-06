export const Tools = {
pencil: "pencil",
eraser: "eraser",
photo: "photo",
notes: "notes",
download: "download",
};

export type MyObject = {
  id: number;
  points: { x: number; y: number }[];
  color: string;
  value: number;
};

type InnerArray = MyObject[];
export type historyType = InnerArray[];

export type ToolsType = (typeof Tools)[keyof typeof Tools];