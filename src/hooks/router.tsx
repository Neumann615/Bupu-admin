import React, { createContext, useContext, useEffect, useRef } from "react";
import { Location, useLocation } from "react-router-dom";

type LocationTrans = {
    from: Location;
    to: Location;
};

export const LocationContext = createContext<React.MutableRefObject<LocationTrans>>(null)

export function WithLocationListener(props: { children: React.ReactNode }) {
    const location = useLocation();

    const locationState = useRef<LocationTrans>({
        from: null,
        to: null,
    })

    useEffect(() => {
        locationState.current.from = locationState.current.to;
        locationState.current.to = location;
    }, [location])

    return (
        <LocationContext.Provider value={locationState}>
            {props.children}
        </LocationContext.Provider>
    )
}

export function useLocationConsumer(): LocationTrans {
    const ref = useContext(LocationContext)
    return ref.current
}