const ManhattanHeuristic = tiles => {
    let distance = 0
    for (let i = 0; i < 16; ++i) {
        let tile = parseInt(getTile(tiles, BigInt(i))) - 1
        if (tile < 0) tile = 15
        distance += Math.abs((i % 4) - (tile % 4)) + Math.abs(((i / 4) | 0) - ((tile / 4) | 0))
    }
    return distance
}
const ModifiedHeuristic = tiles => {
    let distance = 0,
        neighbour_distance = 0
    for (let i = 0; i < 16; ++i) {
        let tile = parseInt(getTile(tiles, BigInt(i))) - 1
        if (tile < 0) tile = 15
        distance += Math.abs((i % 4) - (tile % 4)) + Math.abs(((i / 4) | 0) - ((tile / 4) | 0))
        let neighbours = getNeighbours(tile)
        for (const neighbour of neighbours) {
            let neighbour_tile = parseInt(getTile(tiles, BigInt(neighbour))) - 1
            if (neighbour_tile < 0) neighbour_tile = 15
            let abs = Math.abs(neighbour_tile - tile)
            if (abs !== 1 && abs !== 4) neighbour_distance += 1
        }
    }
    return distance + neighbour_distance
}

// TILE OPERATIONS

const getTile = (tiles, index) => (tiles >> ((15n - index) * 4n)) & 15n

const setTile = (tiles, index, number) => {
    let shift = (15n - index) * 4n
    tiles &= ~(15n << shift)
    tiles |= number << shift
    return tiles
}

let swapTiles = (tiles, index1, index2) => {
    let shift1 = (15n - index1) * 4n,
        shift2 = (15n - index2) * 4n
    let tile1 = (tiles >> shift1) & 15n,
        tile2 = (tiles >> shift2) & 15n
    let swap = tile1 ^ tile2
    swap = (swap << shift1) | (swap << shift2)
    return tiles ^ swap
}

const randomBoardTiles = moves => {
    let tiles = BigInt('0x123456789abcdef0'),
        zero = 15,
        next = null,
        prev = null
    for (let i = 0; i < moves; ++i) {
        next = getNeighbours(zero, prev)
        next = next[(Math.random() * next.length) | 0]
        tiles = swapTiles(tiles, BigInt(zero), BigInt(next))
        prev = zero
        zero = next
    }
    return [tiles, zero]
}

let getNeighbours = (index, parent_zero_index) => [index - 1, index - 4, index + 1, index + 4].filter(neighbour => neighbour >= 0 && neighbour < 16 && Math.abs((neighbour % 4) - (index % 4)) <= 1 && neighbour !== parent_zero_index)

// const randomBoardTiles = _ => Array.from({length: 15}, (_, i) => BigInt(i + 1))
//     .sort(() => Math.random() - 0.5)
//     .reduce((sum, val, ind) => sum | val << BigInt(ind) * 4n, 0n) << 4n

// SOLVING OPERATIONS

const checkBoardParity = tiles => {
    let inv = 0,
        tiles_array = []
    for (let i = 0; i < 16; ++i) {
        tiles_array[i] = (tiles >> ((15n - BigInt(i)) * 4n)) & 15n

        if (tiles_array[i] !== 0n) {
            for (let j = 0; j < i; ++j) if (tiles_array[j] > tiles_array[i]) ++inv
        } else inv += 1 + Math.floor(i / 4)
    }
    return inv
}

if (typeof window === 'undefined') module.exports = [ManhattanHeuristic, ModifiedHeuristic, randomBoardTiles, getNeighbours, swapTiles]
