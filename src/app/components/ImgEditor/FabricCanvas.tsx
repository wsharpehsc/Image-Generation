"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import { FabricImage, IText } from "fabric";

const FabricCanvas = ({ b64 }: { b64: string }) => {
  const { editor, onReady } = useFabricJSEditor();
  const [textColor, setTextColor] = useState("#ffffff");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [fontSize, setFontSize] = useState(30);

  useEffect(() => {
    if (!editor || !editor.canvas) return;

    const loadImage = async () => {
      const image = await FabricImage.fromURL(`data:image/png;base64,${b64}`);
      image.scaleToWidth(500);
      image.scaleToHeight(500);
      editor.canvas.add(image);
      editor.canvas.setWidth(600);
      editor.canvas.setHeight(600);
    };

    loadImage();
  }, [editor, b64]);

  const handleAddText = () => {
    if (!editor || !editor.canvas) return;

    const text = new IText("Edit me", {
      left: 100,
      top: 100,
      fill: textColor,
      fontSize: fontSize,
      fontFamily: fontFamily,
    });

    editor.canvas.add(text);
    editor.canvas.setActiveObject(text);
    editor.canvas.renderAll();
  };

  const updateTextProperties = () => {
    const active = editor?.canvas.getActiveObject() as IText;
    if (active && active.type === "i-text") {
      active.set({
        fill: textColor,
        fontFamily: fontFamily,
        fontSize: fontSize,
      });
      editor?.canvas.renderAll();
    }
  };

  const handleDelete = () => {
    const activeObject = editor?.canvas.getActiveObject();
    if (!editor || !editor.canvas) return;
    if (activeObject) {
      editor.canvas.remove(activeObject);
      editor.canvas.discardActiveObject();
      editor.canvas.renderAll();
    }
  };

  useEffect(() => {
    updateTextProperties();
  }, [textColor, fontFamily, fontSize]);

  return (
    <div className="App space-y-2">
      <div className="flex flex-wrap items-center gap-4 mb-2">
        <button className="btn btn-secondary" onClick={handleAddText}>
          Add Text
        </button>

        <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} title="Text Color" />

        <FontSelector fontFamily={fontFamily} setFontFamily={setFontFamily} />

        <input
          type="number"
          min={10}
          max={200}
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          className="border rounded px-2 py-1 w-20"
          title="Font Size"
        />

        <button className="btn btn-error" onClick={handleDelete}>
          Delete Selected
        </button>
      </div>

      <FabricJSCanvas className="w-full h-auto border border-red-400" onReady={onReady} />
    </div>
  );
};

export default FabricCanvas;

const FontSelector = ({ fontFamily, setFontFamily }: { fontFamily: string; setFontFamily: Dispatch<SetStateAction<string>> }) => {
  return (
    <select className="select" value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
      <option value="Arial">Arial</option>
      <option value="Georgia">Georgia</option>
      <option value="Courier New">Courier New</option>
      <option value="Comic Sans MS">Comic Sans</option>
      <option value="Impact">Impact</option>
      <option value="Times New Roman">Times New Roman</option>
    </select>
  );
};
