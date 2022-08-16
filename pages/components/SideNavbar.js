import {useEffect,useState} from 'react'
import Link from 'next/link'
import styles from '../../styles/Sidebar.module.css'
import { FaGreaterThan } from 'react-icons/fa';

export default function SideNavbar({mrn}){
	return(
		<div className={styles.sidebar}>
            <div className={styles.top}>
                <h1>Casher</h1>
            </div>
            <hr className={styles.horizontal}/>
            <div className={styles.center}>
                <ul className={styles.ullist}>
                    <li className={styles.list}>
                        <Link href={{pathname: `/casher/UnpaidPatient`, query:{ mrn: mrn }}} >
                            <a style={{ textDecoration: "none" }}>
                                <span className={styles.spanstyle}>Unpaid Patient</span>
                            </a>
                        </Link>
                    </li>
                    
                   	<li className={styles.list}>
                        <Link href={{pathname: `/casher/PaidPatient`, query:{ mrn: mrn }}} >
                            <a style={{ textDecoration: "none" }}>
                                <span className={styles.spanstyle}>paid Patient</span>
                            </a>
                        </Link>
                    </li>

                </ul>
            </div> 
        </div>
	)
}
