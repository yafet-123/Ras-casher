import React, {useState, useContext, useEffect} from 'react'
import Cookies from 'universal-cookie';

const AuthContext = React.createContext()

export function useAuth(){
    return useContext(AuthContext)
}

export function AuthProvider({children}){
    const cookies = new Cookies();
    const accesstoken = cookies.get('token')
    const currentUser = cookies.get('user')
    const role = cookies.get('role')
    
    const value = {
        currentUser
    } 
    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>

        // if we are not loading render children
    )
}