import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Redirect} from 'react-router-dom'
import {loginUrl} from '~/constants/Urls'
import {withAuth} from '~/containers'

export class PageLogout extends Component
{
    componentWillMount()
    {
        this.props.clearToken();
    }

    render() {
        const {auth: {token}} = this.props;
        return token ? null : (
            <Redirect to={loginUrl} />
        )

    }
}
PageLogout.propTypes = {
    auth: PropTypes.object,
    clearToken: PropTypes.func
};

export default withAuth(PageLogout);
