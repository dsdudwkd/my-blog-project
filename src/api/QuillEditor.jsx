import { Quill } from "react-quill";

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
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
    "align",
    "color",
    "background",
];
