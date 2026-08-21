import { useState, createContext, useContext } from 'react';

const ApplicationContext = createContext(null);

const ApplicationProvider = ({ children }) => {
    const defaultState = {
        isAdmin: true,
        menuOpen: false,
        error: false,
        showVerified: true
    };

    const [ appState, setAppState ] = useState(defaultState);

    const appAction = {};

    // bool true/open, false/closed. optional.
    appAction.toggleMenu = (bool) => {
        let newState = !appState.menuOpen;

        if (bool === true || bool === false) {
            newState = bool;
        }

        updateAppState({ menuOpen: newState });
    }

    const updateAppState = (newVals) => {
        setAppState(prevVals => {
            return {
                ...prevVals,
                ...newVals
            };
        });
    }

    return (
        <ApplicationContext.Provider value={{appState, appAction, updateAppState}}>
            {children}
        </ApplicationContext.Provider>
    );
};

const useAppContext = () => useContext(ApplicationContext);

// eslint-disable-next-line
export { ApplicationContext, ApplicationProvider, useAppContext };
