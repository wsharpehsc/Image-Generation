"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import { FabricImage, IText, Circle, Rect } from "fabric";
import { FONT_OPTIONS } from "@/app/data/data";
import { RectangleHorizontal, Circle as LucidCircle, Trash } from "lucide-react";
import { useFabricActions } from "./useFabricActions";

interface FabricCanvasProps {
  b64: string;
}

const FabricCanvas = ({ b64 }: FabricCanvasProps) => {
  const { editor, onReady } = useFabricJSEditor();
  const [textColor, setTextColor] = useState("#ffffff");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [fontSize, setFontSize] = useState(30);
  const [colorMode, setColorMode] = useState<"fill" | "stroke">("fill");
  const { addText, addRectangle, addCircle, deleteSelected } = useFabricActions(editor, textColor, fontSize, fontFamily, colorMode);

  useEffect(() => {
    if (!editor || !editor.canvas) return;

    const loadImage = async () => {
      try {
        const image = await FabricImage.fromURL(`data:image/png;base64,${b64}`);
        image.scaleToWidth(500);
        image.scaleToHeight(500);
        editor.canvas.add(image);
        editor.canvas.setWidth(600);
        editor.canvas.setHeight(600);
      } catch (error) {
        console.error("Error loading image:", error);
      }
    };

    loadImage();
  }, [editor, b64]);

  useEffect(() => {
    const active = editor?.canvas.getActiveObject();

    if (!editor || !editor.canvas || !active) return;

    // Update text
    if (active.type === "i-text") {
      active.set({
        fill: colorMode === "fill" ? textColor : (active.fill as string),
        fontFamily,
        fontSize,
      });
    }

    // Update shapes
    if (active.type === "rect" || active.type === "circle") {
      if (colorMode === "fill") {
        active.set("fill", textColor);
      } else if (colorMode === "stroke") {
        active.set("stroke", textColor);
        active.set("strokeWidth", 2);
      }
    }

    editor.canvas.renderAll();
  }, [textColor, fontFamily, fontSize, colorMode, editor]);

  return (
    <div className="flex flex-col gap-2 p-2 bg-base-100 rounded-box shadow-lg w-full max-w-5xl mx-auto items-center">
      {/* Main Controls */}
      <div className="flex flex-col gap-4 bg-base-200 p-4 rounded-box">
        <div className="flex flex-wrap items-center gap-4 justify-between">
          {/* Controls */}
          <div className="flex items-center gap-4">
            <button className="btn btn-primary" onClick={addText}>
              Add Text
            </button>
            <div className="flex items-center gap-2">
              <label className="label">
                <span className="label-text font-medium">Color:</span>
              </label>
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-10 h-10 cursor-pointer rounded-lg border border-base-300"
              />
              <select className="select select-bordered" value={colorMode} onChange={(e) => setColorMode(e.target.value as "fill" | "stroke")}>
                <option value="fill">Fill</option>
                <option value="stroke">Border</option>
              </select>
            </div>
          </div>
          <FontSelector fontFamily={fontFamily} setFontFamily={setFontFamily} />
          <FontSize setFontSize={setFontSize} fontSize={fontSize} />
        </div>
      </div>

      <div className="relative border-2 border-base-300 rounded-box overflow-hidden">
        <div className="flex">
          <div className="flex flex-col gap-2 p-3 bg-base-300 border-r border-base-300">
            <button className="btn btn-sm btn-accent" onClick={addRectangle}>
              <RectangleHorizontal />
            </button>
            <button className="btn btn-sm btn-accent" onClick={addCircle}>
              <LucidCircle />
            </button>
            <button className="btn btn-error" onClick={deleteSelected}>
              <Trash />
            </button>
          </div>

          <div className="flex-1 flex justify-center items-center min-h-[600px]">
            <FabricJSCanvas className="w-full h-full" onReady={onReady} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FabricCanvas;

type FontSelectorProps = {
  fontFamily: string;
  setFontFamily: Dispatch<SetStateAction<string>>;
  disabled?: boolean;
};

const FontSelector = ({ fontFamily, setFontFamily, disabled }: FontSelectorProps) => {
  return (
    <div className="flex items-center gap-2">
      <label className="label">
        <span className="label-text font-medium">Font:</span>
      </label>
      <select className="select select-bordered" value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} disabled={disabled}>
        {FONT_OPTIONS.map((font) => (
          <option key={font.value} value={font.value}>
            {font.label}
          </option>
        ))}
      </select>
    </div>
  );
};

type FontSizeProps = {
  fontSize: number;
  setFontSize: Dispatch<SetStateAction<number>>;
};

const FontSize = ({ fontSize, setFontSize }: FontSizeProps) => {
  return (
    <div className="flex items-center gap-2">
      <label className="label">
        <span className="label-text font-medium">Size:</span>
      </label>
      <input
        type="number"
        min={10}
        max={200}
        value={fontSize}
        onChange={(e) => setFontSize(Number(e.target.value))}
        className="input input-bordered w-20"
      />
    </div>
  );
};
