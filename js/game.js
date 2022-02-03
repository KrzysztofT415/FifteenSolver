const loadBoard = _ => {
    let board = { tiles: 0n, zero_index: null, parent_zero_index: null, h_score: null, g_score: 0, solution_path: [] }
    for (let i = 0; i < 16; ++i) {
        let value = parseInt(document.getElementById(i + 'c').innerText)
        if (!value) {
            value = 0
            board.zero_index = i
        }
        board.tiles = setTile(board.tiles, BigInt(i), BigInt(value))
    }
    board.h_score = current_heuristic.value(board.tiles)
    return board
}

const aStarSearch = board => {
    let queue = new PriorityQueue(board)
    let already_seen = []
    let log_all = document.getElementById('log_all').checked
    info.innerHTML += "Searched permutations: <a id='checked'>0</a>\nCurrent score: <a id='h_cost'>" + board.h_score + "</a>\nCurrent depth: <a id='g_cost'>" + board.g_score + '</a>\n'
    let checked = document.getElementById('checked'),
        checked_num = 0
    let h_cost = document.getElementById('h_cost')
    let g_cost = document.getElementById('g_cost')

    let while_loop = _ => {
        if (queue.isEmpty()) {
            endFailure()
            return
        }

        let current_state = queue.pop().element
        if (log_all) logBoardState(current_state)
        checked.innerText = ++checked_num + ''
        h_cost.innerText = current_state.h_score + ' ' + '*'.repeat(current_state.h_score)
        g_cost.innerText = current_state.g_score

        if (current_state.h_score === 0) {
            endSuccess(current_state)
            return
        }
        already_seen[current_state.tiles] = true

        let neighbours = getNeighbours(current_state.zero_index, current_state.solution_path[current_state.solution_path.length - 1])
        for (let neighbour of neighbours) {
            let next_state_tiles = swapTiles(current_state.tiles, BigInt(current_state.zero_index), BigInt(neighbour))

            if (!already_seen[next_state_tiles]) {
                let next_state = { tiles: next_state_tiles, zero_index: neighbour, h_score: current_heuristic.value(next_state_tiles), g_score: current_state.g_score + 1, solution_path: [...JSON.parse(JSON.stringify(current_state.solution_path)), current_state.zero_index] }
                queue.enqueue(next_state, next_state.h_score + next_state.g_score * 2)
            }
        }
        window.requestAnimationFrame(while_loop)
    }
    window.requestAnimationFrame(while_loop)
}

const solve = _ => {
    info.innerText = ''
    const board = loadBoard()
    info.innerText += '-'.repeat(20) + '\nSTARTING BOARD\n'
    logBoardState(board)

    if (checkBoardParity(board.tiles) & 1) {
        info.innerText += 'HAS NO SOLUTION\n'
        return
    }

    if (board.h_score === 0) {
        info.innerText += 'ALREADY SOLVED\n'
        return
    }

    info.innerText += 'ALGORITHM IS SEARCHING\n'
    aStarSearch(board)
}
