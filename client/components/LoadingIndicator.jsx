import React from 'react'
import {blueGrey200} from 'material-ui/styles/colors';
import CircularProgress from 'material-ui/CircularProgress'

export default function LoadingIndicator()
{
    return (
        <div className="padding-2x">
            <CircularProgress
                color={blueGrey200}
                size={80}
                thickness={5}
                style={{
                    display: 'block',
                    margin: '30px auto'
                }}
            />
        </div>
    );
}
