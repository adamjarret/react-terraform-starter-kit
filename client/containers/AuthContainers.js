import {connect} from 'react-redux';
import * as actions from '~/actions/AuthActions';

function mapStateToProps(state)
{
    const {auth} = state;
    return {
        auth
    };
}

export function withAuth(component)
{
    return connect(mapStateToProps, actions)(component);
}
