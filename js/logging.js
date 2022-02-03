const info = document.getElementById('info')

const findByIndex = index => {
    switch (index) {
        case -1:
            return 'left'
        case -4:
            return 'up'
        case 1:
            return 'right'
        case 4:
            return 'down'
    }
}
const convertSolutionPath = (solution_path, zero_index) => {
    let result = []
    for (let i = 0; i < solution_path.length; ++i) {
        console.log(solution_path[i + 1])
        result[i] = findByIndex((solution_path[i + 1] !== undefined ? solution_path[i + 1] : zero_index) - solution_path[i])
    }
    return result
}

let current_solution = []
const endSuccess = board => {
    document.getElementById('info').innerText += 'SUCCESS\n'
    current_solution = board.solution_path
    info.innerText += '-'.repeat(20) + '\nSOLUTION: ' + board.solution_path.length + ' moves\n' + convertSolutionPath(board.solution_path, 15).reduce((sum, val) => sum + ' ' + val, '') + '\n'

    let log_solution = document.getElementById('log_solution').checked
    if (log_solution) {
        info.innerText += '-'.repeat(20) + '\n'
        logTiles(board.tiles)
        info.innerText += '-'.repeat(20) + '\n'
        let solution = board.tiles,
            zero_index = board.zero_index
        for (let cell of board.solution_path.reverse()) {
            solution = swapTiles(solution, BigInt(zero_index), BigInt(cell))
            zero_index = cell
            logTiles(solution)
            info.innerText += '-'.repeat(20) + '\n'
        }
    }
}
const endFailure = _ => (document.getElementById('info').innerText += 'FAILURE - this should not happen\n')

const logTiles = tiles => {
    for (let i = 0; i < 16; ++i) {
        let tile = (tiles >> ((15n - BigInt(i)) * 4n)) & 15n
        info.innerText += tile.toString() + '\t'
        if (i % 4 === 3) info.innerText += '\n'
    }
}

const logBoardState = board => {
    info.innerText += '#' + board.tiles.toString(16) + '\n'
    logTiles(board.tiles)
    let distance = current_heuristic.value(board.tiles)
    info.innerText += 'heuristic: ' + distance.toString() + '\tdepth: ' + board.g_score.toString() + '\tsum: ' + (distance + board.g_score).toString() + '\n'
    info.innerText += 'solution path:\n' + convertSolutionPath(board.solution_path, board.zero_index).reduce((sum, val) => sum + ' ' + val, '') + '\n'
    info.innerText += '-'.repeat(20) + '\n'
}
