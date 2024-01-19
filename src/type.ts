export const Tools = {
//   selection: "selection",
//   rectangle: "rectangle",
pencil: "pencil",
eraser: "eraser",
photo: "photo",
notes: "notes",
download: "download",
};

export type ToolsType = (typeof Tools)[keyof typeof Tools];