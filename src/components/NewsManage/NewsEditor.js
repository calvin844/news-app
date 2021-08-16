import React, { useState, useEffect } from 'react'
import { Editor } from "react-draft-wysiwyg";
import { ContentState, convertToRaw, EditorState } from "draft-js";
import darftToHtml from "draftjs-to-html";
import htmlToDarft from "html-to-draftjs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default function NewsEditor(props) {
    const { getContent, content } = props
    const [editorState, setEditorState] = useState("")
    useEffect(() => {
        if(content === undefined) return;
        const contentBlock = htmlToDarft(content);
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState)
            setEditorState(editorState)
        }
    }, [content])
    return (
        <div>
            <Editor
                editorState={editorState}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={(editorState) => { setEditorState(editorState) }}
                onBlur={() => {
                    let newsContent = darftToHtml(convertToRaw(editorState.getCurrentContent()))
                    getContent(newsContent)
                }}
            />
        </div>
    )
}
