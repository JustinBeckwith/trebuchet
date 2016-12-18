import React from 'react';
import PlayIcon from 'material-ui/svg-icons/maps/directions-run';
import StopIcon from 'material-ui/svg-icons/content/remove-circle-outline';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import {green500, red500, lightBlue500, grey500} from 'material-ui/styles/colors';


export default class myStatusIcon extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        var color;
        switch (this.props.status) {
            case "started": 
                return <PlayIcon color={green500} />
            case "starting":
            return <RefreshIndicator
                    size={20}
                    left={0}
                    top={0}
                    status="loading" 
                    loadingColor={lightBlue500}
                    style={{display: 'inline-block', position: 'relative'}} />
            case "stopping":
                return <RefreshIndicator
                    size={20}
                    left={0}
                    top={0}
                    status="loading" 
                    loadingColor={red500}
                    style={{display: 'inline-block', position: 'relative'}} />
            case "stopped":
                return <StopIcon color={grey500} />
        }
    }
}