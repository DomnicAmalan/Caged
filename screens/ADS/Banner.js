import React, { useEffect, useState } from 'react';
import {View} from 'react-native';

import { BannerAd, BannerAdSize, TestIds } from '@react-native-firebase/admob';



const Banner  = () => {
   
    return(
        <>
            <BannerAd
                unitId={"ca-app-pub-1567332459331573/4865273748"}
                size={BannerAdSize.SMART_BANNER}
                // onAdClosed={() => setRetry(retry+1), console.log("closed")}
                onAdFailedToLoad={console.log("failed")}
                // onAdLeftApplication={() => setRetry(retry+1), console.log("left")}
                onAdOpened={() => console.log("yesss4")}
                requestOptions={{
                    requestNonPersonalizedAdsOnly: true,
                }}
                keywords={ ['movies',]}
            />
        </>
    )
}

export {Banner}