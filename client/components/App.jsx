import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Loadable from 'react-loadable';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import {blueGrey} from '@material-ui/core/colors';
import Typography from '@material-ui/core/Typography';
import loading from '~/components/LoadingIndicator';
import {homeUrl, loginUrl, logoutUrl} from '~/constants/Urls';

// Use style-loader to add <style> elements to the index.html DOM containing the source of the following CSS files
//require('../styles/bootstrap/bootstrap.min.css'); // custom build, ONLY: grids, responsive utils, media object
require('../styles/app.css');

// MuiTheme overrides
const muiTheme = createMuiTheme({
    palette: {
        primary: {
            main: blueGrey[500],
        }
    },
    typography: {
        fontSize: 16,
        useNextVariants: true,
    }
});

// Dynamically load components (causes webpack to build chunks)
//  Code is split here by route. Child components may also utilize react-loadable to further split themselves.
const PageHome = Loadable({loading, loader: () => import(/* webpackChunkName: "PageHome" */ '~/components/PageHome')});
const PageLogin = Loadable({loading, loader: () => import(/* webpackChunkName: "PageLogin" */ '~/components/PageLogin')});
const PageLogout = Loadable({loading, loader: () => import(/* webpackChunkName: "PageLogout" */ '~/components/PageLogout')});
const PageNotFound = Loadable({loading, loader: () => import(/* webpackChunkName: "PageNotFound" */ '~/components/PageNotFound')});

export default function App()
{
    return (
        <MuiThemeProvider theme={muiTheme}>
            <div>
                <Switch>
                    <Route path={loginUrl} component={PageLogin}/>
                    <Route path={logoutUrl} component={PageLogout}/>
                    <Route exact path={homeUrl} component={PageHome}/>
                    <Route path="*" component={PageNotFound}/>
                </Switch>
                <footer className="align-center padding-2x">
                    <Typography component="p">
                        Created by <a href="https://atj.me">Adam Jarret</a>
                    </Typography>
                </footer>
            </div>
        </MuiThemeProvider>
    );
}
