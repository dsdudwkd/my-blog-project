import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ImageActions } from '@xeger/quill-image-actions';
import { ImageFormats } from '@xeger/quill-image-formats';
Quill.register('modules/imageActions', ImageActions);
Quill.register('modules/imageFormats', ImageFormats);

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
    imageActions: {},
    imageFormats: {},
};
export const formats = [
    "font",
    "size",
    "height",
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
