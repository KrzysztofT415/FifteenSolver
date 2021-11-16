const directions_enum = {
    down: 4,
    up: -4,
    left: -1,
    right: 1
}

const heuristics_array = [ManhattanHeuristic, ModifiedHeuristic]
function* swapper(array) {
    let index = 0
    while (true) yield array[index++ % array.length]
}
const generator = swapper(heuristics_array)


let current_heuristic
const heuristics = _ => {
    current_heuristic = generator.next()
    document.getElementById('heuristics').innerText = current_heuristic.value.name
}
heuristics()

const swapCells = (empty_cell, second_cell) => {
    empty_cell.classList.replace('empty', 'cell')
    second_cell.classList.replace('cell', 'empty')
    empty_cell.innerText = second_cell.innerText
    second_cell.innerText = '-'
}

const cellClick = index => {
    let directions = getNeighbours(index)
    for (let direction of directions) {
        let neighbour_cell = document.getElementById(direction + 'c')
        if (neighbour_cell.classList.contains('empty')) {
            let clicked_cell = document.getElementById(index + 'c')
            swapCells(neighbour_cell, clicked_cell)
            return
        }
    }
}

const autoClick = direction => {
    const board = loadBoard()
    let neighbour = board.zero_index + direction
    if (neighbour < 0 || neighbour >= 16 || Math.abs(neighbour % 4 - board.zero_index % 4) > 1) return 0
    let empty = document.getElementById(board.zero_index + 'c')
    let second = document.getElementById(board.zero_index + direction + 'c')
    swapCells(empty, second)
    return 1
}

const random = () => {
    document.getElementsByClassName('empty')[0].classList.replace('empty', 'cell')
    let last = document.getElementById('15c')
    last.classList.replace('cell', 'empty')
    last.innerText = '-'

    let board = document.getElementsByClassName('cell')
    do {
        board = [...board].sort(() => Math.random() - 0.5)
        for (let i = 0; i < 15; ++i)
            board[i].innerText = (i + 1).toString()
    } while (checkBoardParity(loadBoard().tiles) & 1)
}
const random2 = () => {
    let num = document.getElementById('moves_num').value
    if (!num) num = 40
    let board_tiles = randomBoardTiles(num)
    loadHash(('0' + board_tiles.toString(16)).slice(-16))
}
const loadHash = hash => {
    if (!hash) hash = document.getElementById('load_hash').value
    if (!hash) return
    hash = ('0' + hash).slice(-16)
    let board = [...document.getElementsByClassName('cell'), ...document.getElementsByClassName('empty')]
    hash = hash.split('').map(value => parseInt(value, 16))
    for (let i = 0; i < 16; ++i) {
        if (board[i].innerText === '-') board[i].classList.replace('empty', 'cell')
        if (hash[i] === 0) {
            board[i].classList.replace('cell', 'empty')
            board[i].innerText = '-'
        } else board[i].innerText = hash[i]
    }
}
const autoSolve = () => {
    let solution = [...current_solution, 15]
    for (let i = 1; i < solution.length; i++) {
        let empty = document.getElementById(solution[i - 1] + 'c')
        let second = document.getElementById(solution[i] + 'c')
        ;((i) => setTimeout(() => swapCells(empty, second), 500 + (500 * i)))(i)
    }
}


window.onload = () => {
    const fifteen = document.getElementById('fifteen')

    for (let i = 0; i < 16; ++i) {
        let cell = document.createElement('button')
        cell.id = i + 'c'
        cell.classList.add('cell')
        cell.onclick = () => cellClick(i)
        cell.innerText = (i + 1).toString()

        fifteen.appendChild(cell)
    }
    const last = document.getElementById('15c')
    last.classList.replace('cell', 'empty')
    last.innerText = '-'


    const handleKeys = e => {
        switch (e.code) {
            case 'ArrowUp': return autoClick(directions_enum.up)
            case 'ArrowDown': return autoClick(directions_enum.down)
            case 'ArrowLeft': return autoClick(directions_enum.left)
            case 'ArrowRight': return autoClick(directions_enum.right)
            case 'KeyS': return solve()
            case 'KeyH': return heuristics()
            case 'KeyR': return random()
            case 'KeyE': return experiment()
            case 'KeyM': return random2()
        }
    }
    document.addEventListener('keydown', handleKeys)
}