import React, {useState, useEffect} from'react'
import NativeAdView, {
    CallToActionView,
    IconView,
    HeadlineView,
    TaglineView,
    AdvertiserView,
    AdBadge,
    MediaView,
    
  } from "react-native-admob-native-ads";import {View} from 'react-native';

 
const NativeAds = () => {

    const [retry, setRetry] = useState(0)


    useEffect(() => {
        
    }, [retry])


    return(
        <>
    <View
      style={{
        flex: 1,
        maxHeight: 200
      }}
    >
      <NativeAdView
        style={{
          width: "100%",
          alignSelf: "center",
          height: 100,
        }}
        onAdFailedToLoad={ () =>{console.log("yes"), setRetry(retry+1)}}
        adUnitID="ca-app-pub-1567332459331573/5044225388"
        onAdFailedToLoad={(e) => console.log(e.error)}
      >
        <View
          style={{
            height: 100,
            width: "100%",
          }}
        >
          {/* <AdBadge /> */}
          <View
            style={{
              height: 100,
              width: "100%",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              paddingHorizontal: 10,
            }}
          >
            <IconView
              style={{
                width: 60,
                height: 60,
              }}
            />
            <View
              style={{
                width: "65%",
                maxWidth: "65%",
                paddingHorizontal: 6,
              }}
            >
              <HeadlineView
                style={{
                  fontWeight: "bold",
                  fontSize: 13,
                  color: "white"
                }}
              />
              <TaglineView
                numberOfLines={1}
                style={{
                  fontSize: 11,
                  color: "purple"
                }}
              />
              <AdvertiserView
                style={{
                  fontSize: 10,
                  color: "gray",
                }}
              />
            </View>
            <MediaView
                style={{
                    width: "100%",
                    height: 250,
                }}
            />

            <CallToActionView
              style={{
                height: 45,
                paddingHorizontal: 12,
                backgroundColor: "purple",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 5,
                elevation: 10,
                
              }}
              textStyle={{ color: "white", fontSize: 14 }}
            />
          </View>
        </View>
      </NativeAdView>
    </View>
  </>
    )
}

export {NativeAds}