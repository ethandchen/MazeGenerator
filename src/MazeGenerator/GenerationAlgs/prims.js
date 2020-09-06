//returns an array of edges in the order they are generated
export default function prims(grid, start) {
    let ordered = [];
    let edges = [];
    let visited = [];
    for(var a = 0; a < grid.length; a++) {
        let col = [];
        for(var b = 0; b < grid[0].length; b++) {
            col.push(false);
        }
        visited.push(col);
    }
    //visit the start node
    //update adjacent edges to the node that was just visited
        //push those edges to an array
    let r = start.row;
    let c = start.col;
    visited[r][c] = true;

    let neighbors = getNeighbors(grid, r, c, visited);
    for(var a = 0; a < neighbors.length; a++) {
        let temp = [];
        temp.push(start);
        temp.push(neighbors[a]);
        edges.push(temp);
    }
    //choose a random edge that connects a visted node to a not visited node
    //remove that edge from the list, update the new adjacent nodes and add to the list
    while(edges.length > 0) {
        let k = Math.floor(Math.random()*edges.length);
        let deleted = edges.splice(k, 1);
        let edge = deleted[0];
        let r = edge[1].row;
        let c = edge[1].col;
        if(visited[c][r]) {
            continue;
        }else {
            ordered.push(edge);
        }
        visited[c][r] = true;
        let neighbors = getNeighbors(grid, r, c, visited);
        for(var a = 0; a < neighbors.length; a++) {
            let temp = [];
            temp.push(edge[1]);
            temp.push(neighbors[a]);
            edges.push(temp);
        }
    }

    return ordered;
}
function getNeighbors(grid, r, c, visited) {
    let arr = [];
    let dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];
    for(var a = 0; a < 4; a++) {
        let rr = r + dirs[a][1];
        let cc = c + dirs[a][0];
        if(cc >= 0 && cc < grid.length) {
            if(rr >= 0 && rr < grid[0].length) {
                if(!visited[cc][rr]) {
                    arr.push(grid[cc][rr]);
                }
            }
        }
    }
    return arr;
}