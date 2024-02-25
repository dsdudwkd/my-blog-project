import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ImageResize } from "quill-image-resize-module-react"; // 라이브러리를 임포트합니다.
Quill.register("modules/ImageResize", ImageResize); // Quill에 등록합니다.

export const modules = {
    toolbar: [
        [{ size: ["small", false, "large", "huge"] }, { font: [] }],
        ["bold", "italic", "underline", "strike",],
        [{ color: [] }, { background: [] }, { align: [] },],
        [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
        ],
        ["link", "image", "video",],
        ["blockquote", "code-block"],
        ["clean"],
    ],
    ImageResize: [
        [{parchment: Quill.import("parchment")}],
        [{modules : ["Resize", "DisplaySize"]}]
    ],

};
export const formats = [
    "font",
    "size",
    "width",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "code-block",
    "list",
    "bullet",
    "ordered",
    "indent",
    "link",
    "image",
    "video",
    "align",
    "color",
    "background",
];
