if (typeof window === 'undefined') {
    [_, _, _, getNeighbours, swapTiles] = require('./script')
    PriorityQueue = require('./priority')
}

const experiment = _ => {
    info.innerText = ''
    let iterations = parseInt(document.getElementById('experiments_num').value)
    if (!iterations) iterations = 1
    info.innerText += 'RUNNING ITERATIONS:  ' + iterations + '\n'

    runIterations(iterations)
}
const end = results => {
    info.innerText += results.manhattan.reduce((sum, value) => sum + ' ' + value, 'Manhattan : ')
    info.innerText += results.modified.reduce((sum, value) => sum + ' ' + value, '\nModified : ')
    info.innerText += '\n'
}
const runIterations = iterations => {
    let results = {manhattan: [], modified: []}, results_num = 0
    // let tests = [BigInt('0x123456f7ad0b9ce8'), BigInt('0x12345768fdab9ec0')]
    for (let i = 0; i < iterations; ++i) {
        let current_board_tiles = randomBoardTiles()
        const current_board = {tiles: current_board_tiles, zero_index: 15, parent_zero_index: null, h_score: 100, g_score: 0, solution_path: []}

        aStarSearchQuiet(current_board, ManhattanHeuristic, value => {
            results.manhattan = [...results.manhattan, value]
            results_num++
            info.innerText += 'Manhattan-' + results.manhattan.length + ' : ' + value + '\n'
            if (results_num === iterations * 2) end(results)
        })
        aStarSearchQuiet(current_board, ModifiedHeuristic, value => {
            results.modified = [...results.modified, value]
            results_num++
            info.innerText += 'Modified-' + results.modified.length + ' : ' + value + '\n'
            if (results_num === iterations * 2) end(results)
        })
    }
}


const aStarSearchQuiet = (board, heuristic, callback) => {
    let queue = new PriorityQueue(board)
    let already_seen = []

    let while_loop = _ => {
        if (queue.isEmpty()) {
            console.log('error')
            return
        }

        let current_state = queue.pop().element

        if (current_state.h_score === 0) {
            callback(Object.keys(already_seen).length)
            return
        }
        already_seen[current_state.tiles] = true

        let neighbours = getNeighbours(current_state.zero_index, current_state.solution_path[current_state.solution_path.length - 1])
        for (let neighbour of neighbours) {
            let next_state_tiles = swapTiles(current_state.tiles, BigInt(current_state.zero_index), BigInt(neighbour))

            if (!already_seen[next_state_tiles]) {
                let next_state = {tiles: next_state_tiles,
                    zero_index: neighbour,
                    h_score: heuristic(next_state_tiles),
                    g_score: current_state.g_score + 1,
                    solution_path: [...JSON.parse(JSON.stringify(current_state.solution_path)), current_state.zero_index]}
                queue.enqueue(next_state, next_state.h_score + next_state.g_score * 2)
            }
        }
        window.requestAnimationFrame(while_loop)
    }
    window.requestAnimationFrame(while_loop)
}

const aStarSearchQuietWhile = (board, heuristic) => {
    let queue = new PriorityQueue(board)
    let already_seen = []
    while (!queue.isEmpty()) {
        let current_state = queue.pop().element

        if (current_state.h_score === 0)
            return [Object.keys(already_seen).length, current_state.solution_path.length]

        already_seen[current_state.tiles] = true

        let neighbours = getNeighbours(current_state.zero_index, current_state.solution_path[current_state.solution_path.length - 1])
        for (let neighbour of neighbours) {
            let next_state_tiles = swapTiles(current_state.tiles, BigInt(current_state.zero_index), BigInt(neighbour))

            if (!already_seen[next_state_tiles]) {
                let next_state = {tiles: next_state_tiles,
                    zero_index: neighbour,
                    h_score: heuristic(next_state_tiles),
                    g_score: current_state.g_score + 1,
                    solution_path: [...JSON.parse(JSON.stringify(current_state.solution_path)), current_state.zero_index]}
                queue.enqueue(next_state, next_state.h_score + next_state.g_score * 2)
            }
        }
    }
}
if (typeof window === 'undefined') module.exports = aStarSearchQuietWhile