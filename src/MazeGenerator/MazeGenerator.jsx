import React,  {Component} from 'react';
import Node from './Node/Node';

import './MazeGenerator.css';
import './SolutionAlgs/bfs.js';
import bfs from './SolutionAlgs/bfs.js';
import dfs from './SolutionAlgs/dfs.js';

let GRID_HEIGHT = 20
let GRID_WIDTH = 40;
let START = [0, 0];
let END = [GRID_WIDTH-1, GRID_HEIGHT-1];

export default class MazeGenerator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            grid: [],
            mousePressed: false,
            inProgress: false,     //whether the maze generation is in progress
            generated: false,       //whether the maze has been generated
                                    //and is ready for solving
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
        const {grid, inProgress, generated} = this.state;
        return (
            <div>
            <div className = "mainTitle">Maze Generator</div>
            <div className = "navbar">
                <button id = "button-clear" className = "button" onClick={
                    () => {
                        if(!inProgress) {this.resetMaze();}
                    }    
                }>
                    Clear
                </button>
                <button id = "button-generate" className = "button" onClick={
                    () => {
                        if(!inProgress) {this.createMaze(0, 0)}
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
                    <div className = "speedTitle">Adjust Speed</div>
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
        document.getElementById("button-solve").disabled = true;
    }
    async createMaze() {
        document.getElementById("button-clear").disabled = true;
        document.getElementById("button-solve").disabled = true;
        this.setState({inProgress: true});
        this.setState({generated: false});
        await new Promise((resolve) => {
            resolve(this.createMazeHelper(0, 0, 0, 0));
        });
        this.setState({inProgress: false});
        this.setState({generated: true});
        document.getElementById("button-clear").disabled = false;
        document.getElementById("button-solve").disabled = false;
    }
    //recursive function to help create maze;
    async createMazeHelper(c, r, prevC, prevR) {
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
                    resolve(this.createMazeHelper(cc, rr, c, r))
                }, 10000/((this.state.speed)*(this.state.speed)))
            });
            dirs.splice(num, 1);    //remove element
            //set to current node
            thisNode.className += ' node-current';
        }
        //set to not current node
        thisNode.className = thisNode.className.replace(' node-current', '');
    }
    async solveMaze() {
        //this.solveBFS();
        this.solveDFS();
    }
    async solveBFS() {
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