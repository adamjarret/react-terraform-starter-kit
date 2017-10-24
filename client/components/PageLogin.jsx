import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Redirect} from 'react-router-dom'
import Avatar from 'material-ui/Avatar'
import Paper from 'material-ui/Paper'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import LockIcon from 'material-ui/svg-icons/action/lock'
import {withAuth} from '~/containers'
import {homeUrl} from '~/constants/Urls'
import LoadingIndicator from './LoadingIndicator'

export class PageLogin extends Component
{
    componentWillMount()
    {
        this.setState({password: ''});

        this.handleChange = (ev) => this.setState({password: ev.target.value});

        this.handleSubmit = (ev) => {
            ev.preventDefault();
            this.props.fetchToken(this.state.password);
        };
    }

    render()
    {
        const {auth: {token, error, isLoading}} = this.props;
        return token ? (
            <Redirect to={homeUrl}/>
        ) : (
            <div className="container login">
                <div className="row">
                    <div className="col-md-4 col-md-offset-4">
                        <Paper>
                            <div className="padding-2x">
                                {isLoading ? <LoadingIndicator/> : (
                                    <div>
                                        <div className="mainText">Please Log In</div>

                                        <div className="media">
                                            <div className="media-left">
                                                <Avatar color="#444" icon={<LockIcon/>}/>
                                            </div>
                                            <div className="media-body media-middle">
                                                The demo password is &quot;welcome&quot;
                                            </div>
                                        </div>

                                        <form onSubmit={this.handleSubmit}>
                                            <TextField
                                                fullWidth
                                                floatingLabelText="Password"
                                                type="password"
                                                errorText={!error ? null : (
                                                    error.message ? error.message : 'Unknown error'
                                                )}
                                                value={this.state.password}
                                                onChange={this.handleChange}
                                            />
                                            <RaisedButton
                                                fullWidth
                                                primary
                                                label="Sign In"
                                                type="submit"
                                                style={{marginTop: (error ? '20px' : '0')}}
                                            />
                                        </form>
                                    </div>
                                )}
                            </div>
                        </Paper>
                    </div>
                </div>
            </div>
        );
    }
}

PageLogin.propTypes = {
    // from withAuth
    auth: PropTypes.object,
    fetchToken: PropTypes.func
};

export default withAuth(PageLogin);
