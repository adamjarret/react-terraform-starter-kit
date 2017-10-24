import React from 'react'
import {Switch, Route} from 'react-router-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import {blueGrey500, blueGrey700} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import PageHome from '~/components/PageHome'
import PageLogin from '~/components/PageLogin'
import PageLogout from '~/components/PageLogout'
import PageNotFound from '~/components/PageNotFound'
import {homeUrl, loginUrl, logoutUrl} from '~/constants/Urls'

// Use style-loader to add <style> elements to the index.html DOM containing the source of the following CSS files
require('../styles/bootstrap/bootstrap.min.css'); // custom build, ONLY: grids, responsive utils, media object
require('../styles/app.css');

// Needed for onTouchTap (used by material-ui)
// http://stackoverflow.com/a/34015469/988941
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

// MuiTheme overrides
const muiTheme = getMuiTheme({
    fontFamily: "'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
    fontWeight: 300,
    palette: {
        primary1Color: blueGrey500,
        primary2Color: blueGrey700
    },
});

export default function App()
{
    return (
        <MuiThemeProvider muiTheme={muiTheme}>
            <div>
                <Switch>
                    <Route path={loginUrl} component={PageLogin}/>
                    <Route path={logoutUrl} component={PageLogout}/>
                    <Route exact path={homeUrl} component={PageHome}/>
                    <Route path="*" component={PageNotFound}/>
                </Switch>
                <div className="align-center margin-2x">
                    <p>Created by <a href="https://atj.me">Adam Jarret</a></p>
                </div>
            </div>
        </MuiThemeProvider>
    );
}
