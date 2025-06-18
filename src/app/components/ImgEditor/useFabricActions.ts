import { useCallback } from "react";
import { IText, Rect, Circle } from "fabric";
import { FabricJSEditor } from "fabricjs-react";

export const useFabricActions = (
  editor: FabricJSEditor | undefined,
  textColor: string,
  fontSize: number,
  fontFamily: string,
  colorMode: "fill" | "stroke"
) => {
  const addText = useCallback(() => {
    if (!editor || !editor.canvas) return;
    const text = new IText("Edit me", {
      left: 100,
      top: 100,
      fill: textColor,
      fontSize,
      fontFamily,
    });
    editor.canvas.add(text);
    editor.canvas.setActiveObject(text);
    editor.canvas.renderAll();
  }, [editor, textColor, fontSize, fontFamily]);

  const addRectangle = useCallback(() => {
    if (!editor || !editor.canvas) return;
    const rect = new Rect({
      left: 100,
      top: 100,
      width: 100,
      height: 60,
      fill: colorMode === "fill" ? textColor : "transparent",
      stroke: colorMode === "stroke" ? textColor : undefined,
      strokeWidth: colorMode === "stroke" ? 2 : 0,
    });
    editor.canvas.add(rect);
    editor.canvas.setActiveObject(rect);
    editor.canvas.renderAll();
  }, [editor, textColor, colorMode]);

  const addCircle = useCallback(() => {
    if (!editor || !editor.canvas) return;
    const circle = new Circle({
      left: 150,
      top: 150,
      radius: 50,
      fill: colorMode === "fill" ? textColor : "transparent",
      stroke: colorMode === "stroke" ? textColor : undefined,
      strokeWidth: colorMode === "stroke" ? 2 : 0,
    });
    editor.canvas.add(circle);
    editor.canvas.setActiveObject(circle);
    editor.canvas.renderAll();
  }, [editor, textColor, colorMode]);

  const deleteSelected = useCallback(() => {
    const activeObject = editor?.canvas.getActiveObject();
    if (editor === null || editor === undefined) return;
    if (activeObject) {
      editor.canvas.remove(activeObject);
      editor.canvas.discardActiveObject();
      editor.canvas.renderAll();
    }
  }, [editor]);

  return { addText, addRectangle, addCircle, deleteSelected };
};
