//returns an array of node coordinates in the order they
//are visited
//as well as an array of the solution path
export default function bfs(grid, start, finish) {
    let solution = [];
    let visited = [];
    let bfsArr = [];
    bfsArr.push(start);
    while(bfsArr.length !== 0) {
        let arr = [];
        let k = bfsArr.length;
        for(var i = 0; i < k; i++) {
            const node = bfsArr.shift();
            arr.push(node);
            grid[node.row][node.col].bfsVisited = true;
            if(node === finish) {
                visited.push(arr);
                solution = getSolution(node);
                return [visited, solution];
            }
            let neighbors = getNeighbors(grid, node);
            for(var b = 0; b < neighbors.length; b++) {
                bfsArr.push(neighbors[b]);
            }
        }
        if(arr.length > 0) {
            visited.push(arr);
        }
    }
    return [visited, solution];
}
function getNeighbors(grid, node) {
    let arr = [];
    const r = node.row;
    const c = node.col;
    let dirs = [[-1, 0], [0, 1], [1, 0], [0, -1]];
    for(var a = 0; a < 4; a++) {
        let rr = r + dirs[a][0];
        let cc = c + dirs[a][1];
        if(rr >= 0 && rr < grid.length) {
            if(cc >= 0 && cc < grid[0].length) {
                const {bfsVisited, borderArr} = grid[rr][cc];
                if(!bfsVisited && !borderArr[(a+2)%4]) {
                    grid[rr][cc].previous = grid[r][c];
                    arr.push(grid[rr][cc]);
                }
            }
        }
    }
    return arr;
}
function getSolution(node) {
    let sol = [];
    let temp = node;
    while(temp != null) {
        sol.unshift(temp);
        temp = temp.previous;
    }
    return sol;
}