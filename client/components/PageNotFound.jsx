import React from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import {homeUrl} from '~/constants/Urls';

const styles = (theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing.unit * 2
    }
});

function PageNotFound(props) {
    const { classes } = props;

    return (
        <div className={classes.root}>
            <Grid container spacing={24} justify="center">
                <Grid item xs={12} sm={8} md={6}>
                    <Paper className={classes.paper}>
                        <Typography component="h1" variant="h6"><span>404</span> Not Found</Typography>
                        <Typography component="div"><Link to={homeUrl}>Home</Link></Typography>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
}

PageNotFound.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(PageNotFound);