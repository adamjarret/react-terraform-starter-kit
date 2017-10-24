import React from 'react'
import Paper from 'material-ui/Paper'
import {Link} from 'react-router-dom'
import {homeUrl} from '~/constants/Urls'

export default function PageNotFound()
{
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-8 col-md-offset-2">
                    <Paper>
                        <div className="padding-2x">
                            <h2><span>404</span> Not Found</h2>
                            <Link to={homeUrl}>Home</Link>
                        </div>
                    </Paper>
                </div>
            </div>
        </div>
    );
}
