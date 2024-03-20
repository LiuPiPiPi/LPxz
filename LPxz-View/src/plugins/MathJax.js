let isMathjaxConfig = false // 用于标识是否配置

const initMathjaxConfig = () => {
    if (!window.MathJax) {
        return
    }
    window.MathJax.Hub.Config({
        showProcessingMessages: false, // 关闭js加载过程信息
        messageStyle: 'none', // 不显示信息
        showMathMenu: false,
        jax: ['input/TeX', 'output/PreviewHTML'],
        PreviewHTML: {
            scale: 120,
            linebreaks: { automatic: true },
        },
        tex2jax: {
            // '\'不能合理解析，换行需要四个反斜杠，'\\\\'
            inlineMath: [
                ['$', '$'],
                ['\\\\(', '\\\\)'],
            ],
            displayMath: [
                ['$$', '$$'],
                ['\\\\[', '\\\\]'],
            ],
            skipTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code', 'a'],
            ignoreClass: 'htmlTag|el-tabs|ignore-bracket',
        },
        TeX: {
            equationNumbers: { autoNumber: ['AMS'], useLabelIds: true },
            extensions: ['AMSmath.js', 'AMSsymbols.js', 'extpfeil.js', 'mhchem.js'],
        }
    })
    isMathjaxConfig = true // 配置完成，改为true
}

const MathQueue = function (elementId) {
    if (!window.MathJax) {
        return
    }
    window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, document.getElementById(elementId)])
}

export default {
    isMathjaxConfig,
    initMathjaxConfig,
    MathQueue
}
