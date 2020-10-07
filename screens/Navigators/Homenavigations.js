import * as React from 'react';
import { StackActions, useNavigationState, CommonActions } from '@react-navigation/native';

export const homeNavRef = React.createRef();

export function navigate(name, params) {
    console.log(params)
    homeNavRef.current?.navigate(name, params);
}

export function push(name, params) {    
    homeNavRef.current?.dispatch(  
        StackActions.replace(name, params)
    );
}

export function goBack() {
    homeNavRef.current?.dispatch(
        CommonActions.goBack()
    )
}