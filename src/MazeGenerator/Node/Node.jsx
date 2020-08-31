import React, {Component} from 'react';

import './Node.css';

export default class Node extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        const {col,
            row,
            isStart,
            isEnd,
            visited,
            solVisited,
            borderArr,
            current,
            solved,
        } = this.props;
        let extraName = '';
        if(isStart) { extraName += 'node-start';}
        if(isEnd) { extraName += 'node-end';}
        if(borderArr[0]) { extraName += ' node-up-border';}
        if(borderArr[1]) { extraName += ' node-right-border';}
        if(borderArr[2]) { extraName += ' node-down-border';}
        if(borderArr[3]) { extraName += ' node-left-border';}
        if(visited) { extraName += ' node-visited';}
        if(solVisited) { extraName += ' node-visited-sol';}
        if(current) { extraName += ' node-current';}
        if(solved) { extraName += ' node-solved';}

        return <div 
            id = {`node_${col}_${row}`}
            className={`node ${extraName}`}></div>;
    }
}