// import react-markdown-editor-lite, and a markdown parser you like
import MarkdownIt from 'markdown-it'
import MdEditor from 'react-markdown-editor-lite'
// import style manually
import 'react-markdown-editor-lite/lib/index.css'

// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */)

function handleEditorChange({ html, text }) {
    console.log('handleEditorChange', html, text)
}
const CreateArticle = () => {
    return (
        <>
            <MdEditor style={{ height: '500px' }} renderHTML={text => mdParser.render(text)} onChange={handleEditorChange} />
        </>
    )
}

export default CreateArticle