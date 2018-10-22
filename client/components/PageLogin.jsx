import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom';
import {compose} from 'redux';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import LockIcon from '@material-ui/icons/Lock';
import {withStyles} from '@material-ui/core/styles';
import {withAuth} from '~/containers';
import {homeUrl} from '~/constants/Urls';
import LoadingIndicator from './LoadingIndicator';

const styles = (theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing.unit * 2
    },
    chip: {
        backgroundColor: '#FFF'
    },
    spaced: {
        marginTop: '20px'
    }
});

export class PageLogin extends Component
{
    constructor(props)
    {
        super(props);

        this.state = {password: ''};

        this.handleChange = (ev) => this.setState({password: ev.target.value});

        this.handleSubmit = (ev) => {
            ev.preventDefault();
            this.props.fetchToken(this.state.password);
        };
    }

    render()
    {
        const {auth: {token, error, isLoading}, classes} = this.props;
        return token ? (
            <Redirect to={homeUrl}/>
        ) : (
            <div className={classes.root}>
                <Grid container spacing={24} justify="center">
                    <Grid item xs={12} sm={8} md={6}>
                        <Paper className={classes.paper}>
                            {isLoading ? <LoadingIndicator/> : (
                                <div>
                                    <Typography component="h1" variant="h6" gutterBottom>
                                        Please Sign In
                                    </Typography>
                                    <Chip
                                        avatar={
                                            <Avatar color="#444">
                                                <LockIcon/>
                                            </Avatar>
                                        }
                                        label="The demo password is &quot;welcome&quot;"
                                        className={classes.chip}
                                    />

                                    <form onSubmit={this.handleSubmit} className={classes.spaced}>
                                        <TextField
                                            fullWidth
                                            error={!!error}
                                            type="password"
                                            label="Password"
                                            helperText={!error ? null : (
                                                error.message ? error.message : 'Unknown error'
                                            )}
                                            value={this.state.password}
                                            onChange={this.handleChange}
                                        />
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            type="submit"
                                            className={classes.spaced}
                                        >Sign In</Button>
                                    </form>
                                </div>
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

PageLogin.propTypes = {
    // from withStyles
    classes: PropTypes.object,
    // from withAuth
    auth: PropTypes.object,
    fetchToken: PropTypes.func
};

export default compose(withAuth, withStyles(styles))(PageLogin);