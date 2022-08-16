import {useEffect,useState} from 'react'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Header from './components/Header'
import DisplayPatient from './components/patients'
import {useAuth} from './context/AuthContext'
import { useRouter } from 'next/router'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {AiOutlineSearch} from 'react-icons/ai'

export default function Home() {
    const [key, setKey] = useState('Jobs');
    const {currentUser} = useAuth()
    const router = useRouter();
    useEffect(()=>{
        if(!currentUser){
            router.push('/login')
        }
    },[currentUser,router])

    return (
        <div className={styles.home}> 
            
            <div className="frontPageFirst">
                <Header />
                <Container>
                    <DisplayPatient />
                </Container>
            </div>
        </div>
    )
}

