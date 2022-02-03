const [ManhattanHeuristic, ModifiedHeuristic, randomBoardTiles] = require('../js/maths')
const aStarSearchQuietWhile = require('../js/experiment')

const autoExperiment = (start, end, step, iterations) => {
    for (let j = start; j <= end; j += step) {
        let results = []
        for (let i = 0; i < iterations; ++i) {
            let [current_board_tiles, zero] = randomBoardTiles(j)
            const current_board = { tiles: current_board_tiles, zero_index: zero, parent_zero_index: null, h_score: 100, g_score: 0, solution_path: [] }
            let seed = ('0' + current_board_tiles.toString(16)).slice(-16)

            console.log('modified (' + j + ',' + i + ') - ' + seed)
            let [modified, solution2] = aStarSearchQuietWhile(current_board, ModifiedHeuristic)
            console.log('\t-> ' + modified)

            console.log('manhattan (' + j + ',' + i + ') - ' + seed)
            let [manhattan, solution] = aStarSearchQuietWhile(current_board, ManhattanHeuristic)
            console.log('\t-> ' + manhattan)

            results = [...results, [seed, manhattan, solution, modified, solution2]]
        }

        console.log('\nseed\t\t     manhattan    sol   modified  sol   diff')
        let manhattan_max = 0,
            modified_max = 0,
            manhattan_min = Number.MAX_SAFE_INTEGER,
            modified_min = Number.MAX_SAFE_INTEGER,
            manhattan_avg = 0,
            modified_avg = 0
        for (const [seed, manhattan, solution, modified, solution2] of results) {
            if (manhattan < manhattan_min && manhattan !== modified) manhattan_min = manhattan
            if (manhattan > manhattan_max) manhattan_max = manhattan
            if (modified < modified_min && modified !== manhattan) modified_min = modified
            if (modified > modified_max) modified_max = modified
            manhattan_avg += manhattan
            modified_avg += modified

            let solution_col = solution > solution2 ? '+ ' : '- '
            let solution2_col = solution2 > solution ? '+ ' : '- '
            let alg_col = manhattan > modified ? '  ' : '* '
            let alg2_col = modified > manhattan ? '  ' : '* '
            if (solution === solution2) solution_col = solution2_col = '  '
            if (modified === manhattan) alg_col = alg2_col = '  '
            console.log(seed + '\t' + alg_col + manhattan + '\t' + solution_col + solution + '\t' + alg2_col + modified + '\t' + solution2_col + solution2 + '\t' + Math.abs(manhattan - modified))
        }
        console.log('Manhattan :    avg ' + manhattan_avg / results.length + ';\tmin    ' + manhattan_min + ';\tmax ' + manhattan_max)
        console.log('Modified  :    avg ' + modified_avg / results.length + ';\tmin    ' + modified_min + ';\tmax ' + modified_max)
    }
}
autoExperiment(20, 20, 10, 100)
