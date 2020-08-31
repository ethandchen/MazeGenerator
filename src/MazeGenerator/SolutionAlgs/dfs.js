//returns an array of node coordinates in the order they
//are visited
//as well as an array of the solution path
export default function dfs(grid, start, finish) {
    let solution = [];
    let dfsStack = [];
    let visited = [];
    
    dfsStack.push(start);
    while(dfsStack.length !== 0) {
        const currNode = dfsStack.pop();
        visited.push(currNode);
        grid[currNode.col][currNode.row].solVisited = true;
        if(currNode === finish) {
            solution = getSolution(currNode);
            return [visited, solution];
        }
        let neighbors = getNeighbors(grid, currNode);
        for(const node of neighbors) {
            dfsStack.push(node);
        }
    }

    return [visited, solution];
}
function getNeighbors(grid, node) {
    let arr = [];
    const r = node.row;
    const c = node.col;
    let dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];
    for(var a = 0; a < 4; a++) {
        let rr = r + dirs[a][1];
        let cc = c + dirs[a][0];
        if(cc >= 0 && cc < grid.length) {
            if(rr >= 0 && rr < grid[0].length) {
                const {solVisited, borderArr} = grid[cc][rr];
                if(!solVisited && !borderArr[(a+2)%4]) {
                    grid[cc][rr].previous = grid[c][r];
                    arr.push(grid[cc][rr]);
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