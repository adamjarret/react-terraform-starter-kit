import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVert from '@material-ui/icons/MoreVert';
import {withRouter} from 'react-router-dom';
import {logoutUrl} from '~/constants/Urls';

export class NavMenu extends React.Component
{
    state = {
        anchorEl: null,
    };

    logout = () => this.props.history.push(logoutUrl);

    handleClick = (event) => {
        this.setState({anchorEl: event.currentTarget});
    };

    handleClose = () => {
        this.setState({anchorEl: null});
    };

    render()
    {
        const {anchorEl} = this.state;

        return (
            <div style={{float: 'right', marginTop: '10px', marginRight: '10px'}}>
                <Button
                    aria-owns={anchorEl ? 'nav-menu' : null}
                    aria-haspopup="true"
                    onClick={this.handleClick}
                >
                    <MoreVert/>
                </Button>
                <Menu
                    id="nav-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}
                >
                    <MenuItem onClick={this.logout}>Sign Out</MenuItem>
                </Menu>
            </div>
        );
    }
}

NavMenu.propTypes = {
    history: PropTypes.object
};

export default withRouter(NavMenu);