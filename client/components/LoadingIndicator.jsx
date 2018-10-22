import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function LoadingIndicator()
{
    return (
        <div className="padding-2x">
            <CircularProgress
                color="primary"
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
