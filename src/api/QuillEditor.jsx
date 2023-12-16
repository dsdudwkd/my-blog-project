import React, { useState } from 'react';
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import styled from 'styled-components';
function QuillEditor(props) {
    const [quillValue, setQuillValue] = useState("");

    const handleQuillChange = (content, delta, source, editor) => {
        setQuillValue(editor.getContents());
    };

    const modules = {
        toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [
                { list: "ordered" },
                { list: "bullet" },
                { indent: "-1" },
                { indent: "+1" },
            ],
            ["link", "image"],
            [{ align: [] }, { color: [] }, { background: [] }], // dropdown with defaults from theme
            ["clean"],
        ],
    };
    const formats = [
        "header",
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
        "align",
        "color",
        "background",
    ];



    return (
        <>
            <Box
                sx={{
                    "  .ql-editor": {
                        padding: "30px",
                        boxShadow: "0 0 5px 0 rgba(0, 0, 0, 0.5)",
                        margin: "2px",
                        width: "100%",
                        maxHeight: "75vh",
                        minHeight: "75vh",
                        backgroundColor: "white",
                    },
                    "  .ql-container.ql-snow": {
                        border: "none",
                        display: "flex",
                        justifyContent: "center",
                    },
                }}
            >
                <ReactQuill
                    style={{ height: "600px" }}
                    theme="snow"
                    modules={modules}
                    formats={formats}
                    value={quillValue || ""}
                    onChange={handleQuillChange}
                />
            </Box>
        </>
    );
}

export default QuillEditor;

const Box = styled.form`
    
`