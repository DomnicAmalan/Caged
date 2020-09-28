import * as React from 'react';

export const homeNavRef = React.createRef();

export function navigate(name, params) {
    homeNavRef.current?.navigate(name, params);
}

export function goBack() {
    homeNavRef.current?.goBack();
}