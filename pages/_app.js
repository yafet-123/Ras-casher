import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css'
import '../styles/patient.css'
import {AuthProvider} from './context/AuthContext'
import Router from 'next/router'
import {useState} from 'react'
import NProgress from 'nprogress'
function MyApp({ Component, pageProps }) {
  const [loading,setloading] = useState(false)
  Router.events.on(`routeChangeStart`,(url)=>{
    NProgress.start();
  })

  Router.events.on(`routeChangeComplete`,(url)=>{
    NProgress.done();
  })
  return(
    <div>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </div>
  )
    
}

export default MyApp
