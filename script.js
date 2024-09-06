var isClicked = false;
var currentColor = getComputedStyle(document.documentElement).getPropertyValue('--current-color');
var defaultColor = getComputedStyle(document.documentElement).getPropertyValue('--default-color');
var fillMode = false;
var colors = [
    'rgb(62, 62, 62)',
    'rgb(255, 102, 46)',
    'rgb(26, 218, 84)',
    'rgb(83, 15, 255)',
    'rgb(255, 236, 26)',
    'rgb(255, 255, 255)'
]

var currentColorCode = '1'

function getResFromCookie() {
    let cookies = document.cookie.split('; ')
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].split('=')
        console.log(cookie)
        if (cookie[0] === 'pixel-result') {
            return cookie[1]
        }
    }
    return '0' * 450
}

getResFromCookie()

document.addEventListener('mousedown', function () {
    isClicked = true;
})
document.addEventListener('mouseup', function () {
    isClicked = false;
})

let field = document.querySelector('.field')
let tempRes = getResFromCookie()
console.log('temp', tempRes)

if (tempRes !== '0') {
    for (let i = 0; i < 450; i++) {
        let cell = document.createElement('div')
        cell.classList.add('cell')
        cell.setAttribute('id', `${i}`)
        cell.dataset.color = tempRes[i]
        cell.style.background = colors[parseInt(tempRes[i])]
        field.appendChild(cell)
    }
} else {
    for (let i = 0; i < 450; i++) {
        let cell = document.createElement('div')
        cell.classList.add('cell')
        cell.setAttribute('id', `${i}`)
        cell.dataset.color = '0'
        cell.style.background = colors[0]
        field.appendChild(cell)
    }
}


let cells = document.querySelectorAll('.cell')
cells.forEach(function (elem, id, arr) {
    elem.addEventListener('mouseover', function () {
        if (isClicked) {
            anime({
                targets: elem,
                background: currentColor,
                duration: 200,
                easing: 'linear'
            })
            elem.dataset.color = currentColorCode
        }
        elem.addEventListener('mousedown', function () {
            if ( fillMode ) {
                let cell_id = parseInt(elem.getAttribute('id'))
                fillMode = !fillMode
            anime({
                targets: '.cell',
                background: currentColor,
                easing: 'easeInOutQuad',
                duration: 500,
                delay: anime.stagger(50, {grid: [30, 15], from: cell_id}),
            })
            for ( let i = 0; i < cells.length; i++ ) {
                cells[i].dataset.color = currentColorCode
            }
            }
            else {
                anime({
                    targets: elem,
                    background: currentColor,
                    duration: 500,
                    easing: 'easeInOutQuad',
                })
                elem.dataset.color = currentColorCode
            }
        })
    })
})

let colorCells = document.querySelectorAll('.color-cell')

colorCells.forEach(function(elem, id, arr) {
    elem.addEventListener('click', function() {
        fillMode = false
        currentColor = getComputedStyle(elem).backgroundColor;
        currentColorCode = elem.dataset.colorcode

        document.documentElement.style.cssText = `--current_color: ${currentColor}`
        document.querySelector('.selected').classList.remove('selected')
        elem.classList.add('selected')
    })
})

document.querySelector('.eraser').addEventListener('click', function() {
    currentColor = defaultColor
    currentColorCode = '0'
    document.documentElement.style.cssText = `--current-color: ${currentColor}`
    document.querySelector('.selected').classList.remove('selected')
    this.classList.add('selected')
})

document.querySelector('.fill').addEventListener('click', function() {
    fillMode = !fillMode
    document.querySelector('.selected').classList.remove('selected')
    this.classList.add('selected')
})


setInterval(function(){
    result = ''
    let tempCells = document.querySelector('.cell')
    for(let i = 0; i < tempCells.length; i++ ) {
        result += `${tempCells[i].dataset.color}`
    }

    document.cookie = `pixel-result=${result};max-age=100000`
    console.log(document.cookie)

}, 60000)

document.querySelector('.save').addEventListener('click', function() {
    domtoimage.toJpeg(field, {quality:2})
    .then(function(dataUrl){
        var img = new Image();
        img.src = dataUrl;
        let link = document.createElement('a');
        link.download = 'pixel.jpg'
        link.href = dataUrl
        link.click()
    })
    .catch(function(error) {
        console.error('oops, something went wrong!', error)
    })
})
