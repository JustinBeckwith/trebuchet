import React from 'react';
import PlayIcon from 'material-ui/svg-icons/maps/directions-run';
import StopIcon from 'material-ui/svg-icons/content/remove-circle-outline';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import {green500, red500, lightBlue500, grey500, orange500} from 'material-ui/styles/colors';
import * as AppStates from './../machines/appStates';

export default class myStatusIcon extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        var color;
        let iconStyle = {
            display: 'inline-block',
            position: 'relative',
            verticalAlign: 'middle',
        }
        switch (this.props.status) {
            case AppStates.STARTED: 
                return <PlayIcon color={green500} style={iconStyle} />
            case AppStates.STARTING:
                return <RefreshIndicator
                    size={20}
                    left={0}
                    top={0}
                    status="loading" 
                    loadingColor={lightBlue500}
                    style={iconStyle} />
            case AppStates.STOPPING:
                return <RefreshIndicator
                    size={20}
                    left={0}
                    top={0}
                    status="loading" 
                    loadingColor={red500}
                    style={iconStyle} />
            case AppStates.DEPLOYING:
                return <RefreshIndicator
                    size={20}
                    left={0}
                    top={0}
                    status="loading" 
                    loadingColor={orange500}
                    style={iconStyle} />
            case AppStates.STOPPED:
                return <StopIcon color={grey500} style={iconStyle} />
        }
    }
}