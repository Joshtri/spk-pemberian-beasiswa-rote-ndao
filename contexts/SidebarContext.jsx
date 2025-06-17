"use client";   

import { createContext, useContext, useState } from "react";

const SidebarContext = createContext({ 
    expanded: true, 
    toggleExpanded: () => {} 
});

export const SidebarProvider = ({ children }) => {
    const [expanded, setExpanded] = useState(true);

    const toggleExpanded = () => setExpanded(prev => !prev);

    return (
        <SidebarContext.Provider value={{ expanded, toggleExpanded }}>
            {children}
        </SidebarContext.Provider>
    );
};

export const useSidebar = () => useContext(SidebarContext);
