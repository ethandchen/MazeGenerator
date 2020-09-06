import React,  {Component} from 'react';
import Node from './Node/Node';

import './MazeGenerator.css';
import prims from './GenerationAlgs/prims.js';
import './SolutionAlgs/bfs.js';
import bfs from './SolutionAlgs/bfs.js';
import dfs from './SolutionAlgs/dfs.js';

let GRID_HEIGHT = 20
let GRID_WIDTH = 50;
let START = [0, 0];
let END = [GRID_WIDTH-1, GRID_HEIGHT-1];

const genAlgs = {
    UNSELECTED: "UNSELECTED",
    RBT: "Recursive Backtracking",
    PRIMS: "Prims Algorithm",
}
const solveAlgs = {
    UNSELECTED: "UNSELECTED",
    RBT: "Recursive Backtracking",
    BFS: "Breadth First Search",
}
let prompt = "";
export default class MazeGenerator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            grid: [],
            mousePressed: false,
            inProgress: false,     //whether the maze generation is in progress
            generated: false,       //whether the maze has been generated
                                    //and is ready for solving
            genAlg: genAlgs.UNSELECTED,
            solveAlg: solveAlgs.UNSELECTED,
            speed: 10,
        };
    }
    componentDidMount() {
        this.resetMaze();
    }
    handleOnChange = (e) => {
        const {inProgress, generated} = this.state;
        if(!inProgress || !generated) {
            this.setState({speed: e.target.value});
        }
    }
    render() {
        const {grid, inProgress, generated, genAlg, solveAlg} = this.state;
        if(generated) {
            if(solveAlg === solveAlgs.UNSELECTED) {
                prompt = "Select a Solution Algorithm";
            }else {
                prompt = solveAlg;
            }
        }else {
            if(genAlg === genAlgs.UNSELECTED) {
                prompt = "Select a Generation Algorithm";
            }else {
                prompt = genAlg;
            }
        }
        return (
            <div>
            <link rel="stylesheet"href=
            "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
            </link>
            <div className = "mainTitle">
                <div className = "prompt">
                    {prompt}
                </div>
                Maze Generator
            </div>
            <div className = "navbar">
                <div className = "dropDown">
                    <button className = "dropButton">
                        Generation Algorithms 
                        <i className = "fa fa-caret-down"></i>
                    </button>
                    <div className = "dropDown-content">
                        <button id = "button-rbt" className = "dropDown-button button" onClick={
                            () => {
                                if(!inProgress) {this.setState({genAlg: genAlgs.RBT})}
                            }    
                        }>
                        {genAlgs.RBT}
                        </button>
                        <button id = "button-prims" className = "dropDown-button button" onClick={
                            () => {
                                if(!inProgress) {this.setState({genAlg: genAlgs.PRIMS})}
                            }    
                        }>
                        {genAlgs.PRIMS}
                        </button>
                    </div>
                </div>
                <div className = "dropDown">
                    <button className = "dropButton">
                        Solution Algorithms 
                        <i className = "fa fa-caret-down"></i>
                    </button>
                    <div className = "dropDown-content">
                        <button id = "button-rbt" className = "dropDown-button button" onClick={
                            () => {
                                if(!inProgress) {this.setState({solveAlg: solveAlgs.RBT})}
                            }    
                        }>
                        {solveAlgs.RBT}
                        </button>
                        <button id = "button-bfs" className = "dropDown-button button" onClick={
                            () => {
                                if(!inProgress) {this.setState({solveAlg: solveAlgs.BFS})}
                            }    
                        }>
                        {solveAlgs.BFS}
                        </button>
                    </div>
                </div>
                <button id = "button-clear" className = "button" onClick={
                    () => {
                        if(!inProgress) {this.resetMaze();}
                    }    
                }>
                    Clear
                </button>
                <button id = "button-generate" className = "button" onClick={
                    () => {
                        if(!inProgress && !generated) {this.createMaze(0, 0)}
                    }    
                }>
                    Generate Maze!
                </button>
                <button id = "button-solve" className = "button" onClick={
                    () => {
                        if(!inProgress && generated) {this.solveMaze()};
                    }
                }>
                    Solve Maze!
                </button>
                <div className = "sliderContainer">
                    <div className = "speedTitle">Adjust Generation Speed</div>
                    <input type = "range"
                        min = "5"
                        max = "50"
                        value = {this.state.speed}
                        className = "slider"
                        onChange = {this.handleOnChange}
                        />
                </div>
            </div>
            <div className = "grid">
                {grid.map((col, colInd) => {
                    return (
                        <div key={colInd} className = "col">
                            {col.map((node, nodeInd) => {
                                const {col, 
                                    row, 
                                    isStart,
                                    isEnd,
                                    visited, 
                                    solVisited, 
                                    borderArr, 
                                    current,
                                    solved} = node;
                                return (
                                    <Node
                                        col = {col}
                                        row = {row}
                                        isStart = {isStart}
                                        isEnd = {isEnd}
                                        visited = {visited}
                                        solVisited = {solVisited}
                                        borderArr = {borderArr}
                                        current = {current}
                                        solved = {solved}
                                    >
                                    </Node>
                                )
                            })}
                        </div>
                    );
                })}
            </div>
            </div>
        )
    }
    resetMaze() {
        const grid = [];
        for(let c = 0; c < GRID_WIDTH; c++) {
            const col = [];
            for(let r = 0; r < GRID_HEIGHT; r++) {
                col.push(node(c, r));
            }
            grid.push(col);
        }
        this.setState({grid});
        this.setState({inProgress: false});
        this.setState({generated: false});
        this.setState({genAlg: genAlgs.UNSELECTED});
        this.setState({solveAlg: solveAlgs.UNSELECTED});
    }
    createMaze() {
        const {genAlg} = this.state;
        switch(genAlg) {
            case genAlgs.RBT:
                this.createMazeDFS();
                break;
            case genAlgs.PRIMS:
                this.createMazePrims(0, 0);
                break;
        }
    }
    async createMazeDFS() {
        this.setState({inProgress: true});
        this.setState({generated: false});
        await new Promise((resolve) => {
            resolve(this.createMazeDFSHelper(GRID_WIDTH/2, GRID_HEIGHT/2, GRID_WIDTH/2, GRID_HEIGHT/2));
        });
        this.setState({inProgress: false});
        this.setState({generated: true});
    }
    //recursive function to help create maze;
    async createMazeDFSHelper(c, r, prevC, prevR) {
        //check for base cases
        if(r < 0 || r >= GRID_HEIGHT || c < 0 || c >= GRID_WIDTH) {
            return;
        }
        const {grid} = this.state;
        if(grid[c][r].visited) {
            return false;
        }
        //set node to visited
        const col = grid[c];
        const node = col[r];
        const newNode = {
            ...node,
            visited: true,
        };
        grid[c][r] = newNode;
        let thisNode = document.getElementById(`node_${c}_${r}`);
        thisNode.className += ' node-visited';

        //set node to the current one
        thisNode.className += ' node-current';
        
        //set boundaries of node
        let dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];
        let borderNames = [' node-up-border', 
                        ' node-right-border', 
                        ' node-down-border',
                        ' node-left-border']
        for(var i = 0; i < 4; i++) {
            let dir = dirs[i];
            let rr = r + dir[1];
            let cc = c + dir[0];
            if(rr !== prevR || cc !== prevC) {
                //set boundary
                grid[c][r].borderArr[i] = true;
                thisNode.className += borderNames[i];
            }else {
                //erase boundary from previous node
                grid[prevC][prevR].borderArr[(i + 2)%4] = false;
                let previous = document.getElementById(`node_${prevC}_${prevR}`);
                previous.className = previous.className.replace(borderNames[(i + 2)%4], '');
            }
        }

        //call recursive function in each direction
        let num = 0;
        let dir = dirs[0];
        for(var k = 4; k > 0; k--) {
            num = Math.floor(Math.random()*k);
            dir = dirs[num];
            let rr = r + dir[0];
            let cc = c + dir[1];

            await new Promise(resolve => {
                setTimeout(() => {
                    //set node to not current node
                    thisNode.className = thisNode.className.replace(' node-current', '');
                    resolve(this.createMazeDFSHelper(cc, rr, c, r))
                }, 10000/((this.state.speed)*(this.state.speed)))
            });
            dirs.splice(num, 1);    //remove element
            //set to current node
            thisNode.className += ' node-current';
        }
        //set to not current node
        thisNode.className = thisNode.className.replace(' node-current', '');
    }
    async createMazePrims(rStart, cStart) {
        this.setState({inProgress: true});
        this.setState({generated: false});
        const{grid} = this.state;
        let startNode = document.getElementById(`node_${cStart}_${rStart}`);
        startNode.className += ' node-visited';
        //set boundaries of node
        let dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];
        let borderNames = [' node-up-border', 
                        ' node-right-border', 
                        ' node-down-border',
                        ' node-left-border']
        for(var i = 0; i < 4; i++) {
            grid[cStart][rStart].borderArr[i] = true;
            startNode.className += borderNames[i];
        }

        let edges = prims(grid, grid[cStart][rStart]);
        for(const edge of edges) {
            await new Promise((resolve) => {
                setTimeout(() => {
                    let r = edge[1].row;
                    let c = edge[1].col;
                    let prevR = edge[0].row;
                    let prevC = edge[0].col;
                    let thisNode = document.getElementById(`node_${c}_${r}`);
                    thisNode.className += ' node-visited';
                    grid[c][r].visited = true;
                    //alert(prevR + " " + prevC + "\n" + r + " " + c);
                    for(var i = 0; i < 4; i++) {
                        let dir = dirs[i];
                        let rr = r + dir[1];
                        let cc = c + dir[0];
                        if(rr !== prevR || cc !== prevC) {
                            //set boundary
                            grid[c][r].borderArr[i] = true;
                            thisNode.className += borderNames[i];
                        }else {
                            //erase boundary from previous node
                            grid[prevC][prevR].borderArr[(i + 2)%4] = false;
                            let previous = document.getElementById(`node_${prevC}_${prevR}`);
                            previous.className = previous.className.replace(borderNames[(i + 2)%4], '');
                        }
                    }
                    resolve(true);
                }, 10000/((this.state.speed)*(this.state.speed)))
            });
            
        }
        this.setState({inProgress: false});
        this.setState({generated: true});;
    }
    async solveMaze() {
        const {solveAlg} = this.state;
        switch(solveAlg) {
            case solveAlgs.RBT: 
                this.solveDFS();
                break;
            case solveAlgs.BFS:
                this.solveBFS();
                break;
        }
    }
    async solveBFS() {
        //alert("HII");
        await new Promise(
            resolve => {
                this.setState({inProgress: true});
                resolve(true);
            }
        );
        const {grid} = this.state;
        let arr = bfs(grid, grid[0][0], grid[grid.length-1][grid[0].length-1]);
        let arr1 = arr[0];
        let sol = arr[1];
        for(const temp of arr1) {
            await new Promise(
                resolve => {
                    setTimeout(() => {
                        resolve(this.solveBFSHelper(grid, temp));
                    }, 20);
                }
            );
        }
        for(const n of sol) {
            await new Promise(
                resolve => {
                    setTimeout(() => {
                        let thisNode = document.getElementById(`node_${n.col}_${n.row}`);
                        grid[n.col][n.row].solved = true;
                        thisNode.className += ' node-solved';
                        resolve(true);
                    }, 20);
                }
            );
        }
        this.setState({inProgress: false});
    }
    async solveBFSHelper(grid, arr) {
        for(const n of arr) {
            let thisNode = document.getElementById(`node_${n.col}_${n.row}`);
            grid[n.col][n.row].solVisited = true;
            thisNode.className += ' node-visited-sol';
        }
    }
    async solveDFS() {
        await new Promise(
            resolve => {
                this.setState({inProgress: true});
                resolve(true);
            }
        );
        const {grid} = this.state;
        let arr = dfs(grid, grid[0][0], grid[grid.length-1][grid[0].length-1]);
        let arr1 = arr[0];
        let sol = arr[1];
        for(const n of arr1) {
            await new Promise(
                resolve => {
                    setTimeout(() => {
                        let thisNode = document.getElementById(`node_${n.col}_${n.row}`);
                        grid[n.col][n.row].solVisited = true;
                        thisNode.className += ' node-visited-sol';
                        resolve(true);
                    }, 20);
                }
            );
        }
        for(const n of sol) {
            await new Promise(
                resolve => {
                    setTimeout(() => {
                        let thisNode = document.getElementById(`node_${n.col}_${n.row}`);
                        grid[n.col][n.row].solved = true;
                        thisNode.className += ' node-solved';
                        resolve(true);
                    }, 20);
                }
            );
        }
        this.setState({inProgress: false});
    }
}
let node = (col, row) => {
    return {col, 
        row, 
        visited: false, 
        solVisited: false,
        isStart: (col === START[0] && row === START[1]),
        isEnd: (col === END[0] && row === END[1]),
        borderArr: [false, false, false, false], //up, right, down, left
        current: false,
        previous: null,
        solved: false
    };
};