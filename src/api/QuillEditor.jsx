import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageResize from '@looop/quill-image-resize-module-react'

Quill.register('modules/ImageResize', ImageResize);

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
    ImageResize: { modules: ["Resize"] }

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
