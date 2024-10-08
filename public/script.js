const canvas = document.getElementById('myCanvas')
let ctx = canvas.getContext('2d');
const canvasInput = document.getElementById('canvasInput')
//buttons
let addTextBtn = document.getElementById('addText')
const addBtn = document.getElementById('add')
const undoBtn = document.getElementById('undo')
const redoBtn = document.getElementById('redo')
//all inputs
// text input
const textInput = document.getElementById('text')
//font style input
const fontStyleInput = document.getElementById('fontStyle')
//font size input
const fontSizeInput = document.getElementById('fontSize')
//bold text input
const boldTextInput = document.getElementById('bold')
//italic text input
const italicTextInput = document.getElementById('italic')
//align text input
const alignTextInput = document.getElementById('align')
//underline text input
const underlineTextInput = document.getElementById('underline')
//all checkboxes
const checkboxes = document.querySelectorAll('.checkbox')
//eventlistener on all checkboxes
checkboxes.forEach(i => {
    i.addEventListener('change', () => { styleCheckbox() })
})
//stop bubbling on canvasInput
canvasInput.addEventListener('click', ()=>{
    event.stopPropagation()
})
//font size increase
function increaseFontSize(){
    fontSizeInput.value = Number(fontSizeInput.value) + 1 
}

//font size decrease
function decreaseFontSize(){
    fontSizeInput.value = Number(fontSizeInput.value) - 1 
}
//function to display text input
addTextBtn.addEventListener('click',()=>{
    event.stopPropagation()
    canvasInput.style.visibility = 'visible'
})
document.addEventListener('click',()=>{
    canvasInput.style.visibility = 'hidden'
})

//finction to change the style of checkbox
function styleCheckbox(selectedText) {
    if (selectedText) {
        //for bold
        selectedText.bold === true ? document.getElementById(`boldImg`).style.backgroundColor = '#b076f5' : document.getElementById(`boldImg`).style.backgroundColor = 'transparent'
        //for italic
        selectedText.italic === true ? document.getElementById(`italicImg`).style.backgroundColor = '#b076f5' : document.getElementById(`italicImg`).style.backgroundColor = 'transparent'
        //for align
        selectedText.align === true ? document.getElementById(`alignImg`).style.backgroundColor = '#b076f5' : document.getElementById(`alignImg`).style.backgroundColor = 'transparent'
        //for underline
        selectedText.underline === true ? document.getElementById(`underlineImg`).style.backgroundColor = '#b076f5' : document.getElementById(`underlineImg`).style.backgroundColor = 'transparent'
    }
    else {
        checkboxes.forEach(i => {
            if (i.checked) {
                document.getElementById(`${i.id}Img`).style.backgroundColor = '#b076f5'
            } else {
                document.getElementById(`${i.id}Img`).style.backgroundColor = 'transparent'
            }
        })
    }
}

//it will enable "Add" button when the input text length will be 1 or more then 1
textInput.addEventListener('input', () => {
    if (textInput.value.length === 0) {
        addBtn.setAttribute("disabled", "")
    }
    else if (textInput.value.length === 1 || textInput.value.length > 1) {
        addBtn.removeAttribute('disabled')
    }
})

const texts = []
//undo redo
const undo = [[]]
const redo = []


//function to check if the any changes happen in texts array
function checkTextsArray() {
    function checkCondition() {
        const lastElementOfundo = undo.length - 1
        const textE = JSON.stringify(texts)
        const undoE = JSON.stringify(undo[lastElementOfundo])
        let isSame
        undoE === textE ? isSame = true : isSame = false
        if (!isSame) {
            undo.push(JSON.parse(textE))
            console.log('pushed')
        }
    }
    checkCondition()

}

//check in every 0.5 sec to texts array
setInterval(() => { checkTextsArray() }, 500)

//adding text on canvas
addBtn.addEventListener('click', () => {
    let text = textInput.value
    let textWidth = ctx.measureText(text).width
    let x = canvas.width / 2 - (textWidth / 2)
    let y = canvas.height / 2
    let fontSize = fontSizeInput.value
    let fontStyle = fontStyleInput.value
    let italic = 'normal'
    let bold = 'normal'
    if (italicTextInput.checked === true) {
        italic = 'italic'
    }
    if (boldTextInput.checked === true) {
        bold = 'bold'
    }
    ctx.font = `${italic} ${bold} ${fontSize}px ${fontStyle}`
    //appending text into a texts array

    //parsing bold and italic to save the text
    //for bold
    if (bold === 'bold') {
        bold = true
    } else {
        bold = false
    }
    //for italic
    if (italic === 'italic') {
        italic = true
    } else {
        italic = false
    }
    let newText = {
        text: text,
        x: x,
        y: y,
        fontStyle: fontStyle,
        fontSize: fontSize,
        bold: bold,
        italic: italic,
        align: true,
        underline: false,
        isDragging: false
    }
    texts.push(newText)
    textInput.value = ''
    addBtn.setAttribute('disabled', '')

    checkboxes.forEach(i => {
        i.checked = false
        styleCheckbox()
    })
    drawTexts()
    canvasInput.style.visibility = 'hidden'
})

//function to add text on canvas
function drawTexts() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    texts.forEach(textObject => {
        let isBold = textObject.bold === true ? 'bold' : 'normal'
        let isItalic = textObject.italic === true ? 'italic' : 'normal'
        ctx.font = `${isItalic} ${isBold} ${textObject.fontSize}px ${textObject.fontStyle}`;
        ctx.fillStyle = textObject.color;
        ctx.fillText(textObject.text, textObject.x, textObject.y);
    });
}

drawTexts()

//function for undo
function undoFn() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let lastElementOfundo = undo.length - 1
    console.log(lastElementOfundo)
    undo[lastElementOfundo].forEach(e => {
        let isBold = e.bold === true ? 'bold' : 'normal'
        let isItalic = e.italic === true ? 'italic' : 'normal'
        ctx.font = `${isItalic} ${isBold} ${e.fontSize}px ${e.fontStyle}`;
        ctx.fillStyle = e.color;
        ctx.fillText(e.text, e.x, e.y);
    })
    redo.push(undo[lastElementOfundo])
    undo.pop()
}
//event listener on undoBtn
undoBtn.addEventListener('click', () => { undoFn() })

//function for redo
function redoFn() {
    if (redo.length > 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        redo[0].forEach(e => {
            let isBold = e.bold === true ? 'bold' : 'normal'
            let isItalic = e.italic === true ? 'italic' : 'normal'
            ctx.font = `${isItalic} ${isBold} ${e.fontSize}px ${e.fontStyle}`;
            ctx.fillStyle = e.color;
            ctx.fillText(e.text, e.x, e.y);
        })
        undo.push(redo[0])
        redo.shift()
    }
}
//event listener on redoBtn
redoBtn.addEventListener('click', () => { redoFn() })

//function to check if the mouse is over text or not
function checkMouseOver(mouseX, mouseY, textObject) {
    ctx.font = `${textObject.fontSize}px ${textObject.fontStyle}`
    const textWidth = ctx.measureText(textObject.text).width
    const textHeight = parseInt(ctx.font, 10)
    if (mouseX >= textObject.x && mouseX <= textObject.x + textWidth &&
        mouseY <= textObject.y && mouseY >= textObject.y - textHeight) {
        return true
    }
    else {
        return false
    }
}

let offsetX, offsetY;
let draggableText = null;
let selectedText = null;

//double click text to select for styling
canvas.addEventListener('dblclick', (e) => {
    let mouseX = e.offsetX
    let mouseY = e.offsetY
    texts.forEach(textObject => {
        if (checkMouseOver(mouseX, mouseY, textObject)) {
            selectedText = textObject
            //updateing the input feild according to this object
            fontStyleInput.value = selectedText.fontStyle
            fontSizeInput.value = selectedText.fontSize
            boldTextInput.checked = selectedText.bold
            italicTextInput.checked = selectedText.italic
            alignTextInput.checked = selectedText.align
            underlineTextInput.checked = selectedText.underline
            styleCheckbox(selectedText)
        }
    })
})
//selecting text to drag
canvas.addEventListener('mousedown', (e) => {
    let mouseX = e.offsetX
    let mouseY = e.offsetY

    texts.forEach(textObject => {
        if (checkMouseOver(mouseX, mouseY, textObject)) {
            textInput.align = false
            textObject.isDragging = true
            draggableText = textObject
            offsetX = mouseX - textObject.x;
            offsetY = mouseY - textObject.y;
        }
    })
})

//Dragging the selected text
canvas.addEventListener('mousemove', (e) => {
    let mouseX = e.offsetX
    let mouseY = e.offsetY
    if (draggableText != null) {
        draggableText.x = mouseX
        draggableText.y = mouseY
        drawTexts()
    }
})

//Diselecting text
canvas.addEventListener('mouseup', () => {
    return draggableText = null
})

