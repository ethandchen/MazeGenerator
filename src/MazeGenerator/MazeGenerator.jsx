import React,  {Component} from 'react';
import Node from './Node/Node';

import './MazeGenerator.css';
import './SolutionAlgs/bfs.js';
import bfs from './SolutionAlgs/bfs.js';

let GRID_HEIGHT = 20
let GRID_WIDTH = 40;
let START = [0, 0];
let END = [GRID_HEIGHT-1, GRID_WIDTH-1];

export default class MazeGenerator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            grid: [],
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
            <div className = "mainTitle">Maze Generation Visualizer</div>
            <div className = "sliderContainer">
                <div className = "speedTitle">Adjust Speed</div>
                <input type = "range"
                    min = "5"
                    max = "50"
                    value = {this.state.speed}
                    className = "slider"
                    onChange = {this.handleOnChange}
                    />
                <button id = "button-generate" className = "button" onClick={
                    () => {
                        if(!inProgress) {this.createMaze(0, 0)}
                    }    
                }>
                    Generate Maze!
                </button>
            </div>
            <div className = "grid">
                {grid.map((row, rowInd) => {
                    return (
                        <div key={rowInd} className = "row">
                            {row.map((node, nodeInd) => {
                                const {row, 
                                    col, 
                                    isStart,
                                    isEnd,
                                    visited, 
                                    bfsVisited, 
                                    borderArr, 
                                    current,
                                    solved} = node;
                                return (
                                    <Node
                                        row = {row}
                                        col = {col}
                                        isStart = {isStart}
                                        isEnd = {isEnd}
                                        visited = {visited}
                                        bfsVisited = {bfsVisited}
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
            <button id = "button-clear" className = "button" onClick={
                () => {
                    if(!inProgress) {this.resetMaze();}
                }    
            }>
                Clear
            </button>
            <button id = "button-solve" className = "button" onClick={
                () => {
                    if(!inProgress && generated) {this.solveMaze()};
                }
            }>
                Solve Maze!
            </button>
            </div>
        )
    }
    resetMaze() {
        const grid = [];
        for(let r = 0; r < GRID_HEIGHT; r++) {
            const row = [];
            for(let c = 0; c < GRID_WIDTH; c++) {
                row.push(node(r, c));
            }
            grid.push(row);
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
    async createMazeHelper(r, c, prevR, prevC) {
        //check for base cases
        if(r < 0 || r >= GRID_HEIGHT || c < 0 || c >= GRID_WIDTH) {
            return;
        }
        const {grid} = this.state;
        if(grid[r][c].visited) {
            return false;
        }
        //set node to visited
        const row = grid[r];
        const node = row[c];
        const newNode = {
            ...node,
            visited: true,
        };
        grid[r][c] = newNode;
        let thisNode = document.getElementById(`node_${r}_${c}`);
        thisNode.className += ' node-visited';

        //set node to the current one
        thisNode.className += ' node-current';
        
        //set boundaries of node
        let dirs = [[-1, 0], [0, 1], [1, 0], [0, -1]];
        let borderNames = [' node-up-border', 
                        ' node-right-border', 
                        ' node-down-border',
                        ' node-left-border']
        for(var i = 0; i < 4; i++) {
            let dir = dirs[i];
            let rr = r + dir[0];
            let cc = c + dir[1];
            if(rr !== prevR || cc !== prevC) {
                //set boundary
                grid[r][c].borderArr[i] = true;
                thisNode.className += borderNames[i];
            }else {
                //erase boundary from previous node
                grid[prevR][prevC].borderArr[(i + 2)%4] = false;
                let previous = document.getElementById(`node_${prevR}_${prevC}`);
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
                    resolve(this.createMazeHelper(rr, cc, r, c))
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
                        resolve(this.solveMazeHelper(grid, temp));
                    }, 20);
                }
            );
        }
        for(const n of sol) {
            await new Promise(
                resolve => {
                    setTimeout(() => {
                        let thisNode = document.getElementById(`node_${n.row}_${n.col}`);
                        grid[n.row][n.col].solved = true;
                        thisNode.className += ' node-solved';
                        resolve(true);
                    }, 20);
                }
            );
        }
        this.setState({inProgress: false});
    }
    async solveMazeHelper(grid, arr) {
        for(const n of arr) {
            let thisNode = document.getElementById(`node_${n.row}_${n.col}`);
            grid[n.row][n.col].bfsVisited = true;
            thisNode.className += ' node-visited-bfs';
        }
    }
}
let node = (row, col) => {
    return {row, 
        col, 
        visited: false, 
        bfsVisited: false,
        isStart: (row === START[0] && col === START[1]),
        isEnd: (row === END[0] && col === END[1]),
        borderArr: [false, false, false, false], //up, right, down, left
        current: false,
        previous: null,
        solved: false
    };
};