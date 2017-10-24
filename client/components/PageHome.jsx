import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Redirect, withRouter} from 'react-router-dom'
import {compose} from 'redux'
import Paper from 'material-ui/Paper'
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import {endpointPrefix, loginUrl, logoutUrl} from '~/constants/Urls'
import {withAuth} from '~/containers'

const headImgUrl = endpointPrefix + '/private/treasure.jpg';
const audioFileName = endpointPrefix + '/private/tada';

export class PageHome extends Component
{
    componentWillMount()
    {
        this.logout = () => this.props.history.push(logoutUrl);
    }

    render()
    {
        const {auth: {token}} = this.props;
        return !token ? (
            <Redirect to={loginUrl}/>
        ) : (
            <div className="container">
                <div className="row">
                    <div className="col-md-8 col-md-offset-2">
                        <Paper>
                            <div className="group">
                                <IconMenu
                                    iconButtonElement={<IconButton><MoreVertIcon/></IconButton>}
                                    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                                    targetOrigin={{horizontal: 'right', vertical: 'top'}}
                                    style={{float: 'right'}}
                                >
                                    <MenuItem primaryText="Sign Out" onTouchTap={this.logout}/>
                                </IconMenu>
                            </div>
                            <div className="overlay-container loaded group">
                                <a href={headImgUrl} target="_blank">
                                    <img src={headImgUrl} alt="Photo" className="headImg"/>
                                </a>
                                <div className="overlay">
                                    <div className="text">
                                        You found the treasure!
                                    </div>
                                </div>
                            </div>
                            <div style={{padding: '10px'}}>
                                <audio preload="metadata" style={{width: '100%'}} controls>
                                    <source src={audioFileName + '.ogg'} id="oggSource" type="audio/ogg" />
                                    <source src={audioFileName + '.mp3'} id="mp3Source" type="audio/mpeg" />
                                    Your browser does not support the audio element.
                                </audio>
                            </div>
                        </Paper>
                    </div>
                </div>
            </div>
        );
    }
}

PageHome.propTypes = {
    auth: PropTypes.object,
    history: PropTypes.object
};

export default compose(withAuth, withRouter)(PageHome)
