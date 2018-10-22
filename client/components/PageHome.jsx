import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom';
import {compose} from 'redux';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';
import {loginUrl} from '~/constants/Urls';
import {endpointPrefix} from '~/constants/ClientConfig';
import {withAuth} from '~/containers';
import NavMenu from './NavMenu';

const headImgUrl = endpointPrefix + '/private/treasure.jpg';
const audioFileName = endpointPrefix + '/private/tada';

const styles = (theme) => ({
    root: {
        flexGrow: 1
    },
    player: {
        padding: '10px'
    },
    audio: {
        width: '100%'
    },
    headImg: {
        display: 'block',
        width: '100%',
        height: 'auto',
        minHeight: '300px'
    },
    overlayContainer: {
        position: 'relative'
    },
    overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        overflow: 'hidden',
        width: '100%',
        height: 'auto'
    },
    overlayText: {
        lineHeight: '1.5em',
        padding: '10px',
        color: '#FFFFFF',
        [theme.breakpoints.up('sm')]: {
            padding: '20px',
        }
    }
});

export class PageHome extends Component
{
    render()
    {
        const {auth: {token}, classes} = this.props;
        return !token ? (
            <Redirect to={loginUrl}/>
        ) : (
            <div className={classes.root}>
                <Grid container spacing={24} justify="center">
                    <Grid item xs={12} sm={8} md={6}>
                        <Paper>
                            <header className="group">
                                <NavMenu/>
                            </header>
                            <main>
                                <div className={classes.overlayContainer + ' group'}>
                                    <a href={headImgUrl} target="_blank" rel="noopener noreferrer">
                                        <img src={headImgUrl} alt="Photo" className={classes.headImg}/>
                                    </a>
                                    <div className={classes.overlay}>
                                        <Typography className={classes.overlayText} component="div">
                                            You found the treasure!
                                        </Typography>
                                    </div>
                                </div>
                                <div className={classes.player}>
                                    <audio preload="metadata" className={classes.audio} controls>
                                        <source src={audioFileName + '.ogg'} id="oggSource" type="audio/ogg"/>
                                        <source src={audioFileName + '.mp3'} id="mp3Source" type="audio/mpeg"/>
                                        <Typography component="p">
                                            Your browser does not support the audio element.
                                        </Typography>
                                    </audio>
                                </div>
                            </main>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

PageHome.propTypes = {
    auth: PropTypes.object,
    classes: PropTypes.object
};

export default compose(withAuth, withStyles(styles))(PageHome);

