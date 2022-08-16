import Header from '../components/Header'
import SideNavbar from '../components/SideNavbar'
import {AiOutlineRight} from 'react-icons/ai'
import Link from 'next/link'
import { useRouter } from "next/router";
import axios from "axios";
import {useEffect,useState } from 'react'
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Cookies from 'universal-cookie';
import {useAuth} from '../context/AuthContext'
import styles from '../../styles/Home.module.css'
import moment from 'moment'
import api from '../components/api.js'

export async function getServerSideProps(context) {
   const {params,req,res,query} = context
   const patient_id_Medical_Record = query.mrn
   const token = req.cookies.token
   if (!token) {
      return {
            redirect: {
            destination: '/login',
            permanent: false,
            },
         }
    }
   const accesstoken = token
   const authaxios = axios.create({
      baseURL : api,
      headers :{
         Authorization : `Bearer ${accesstoken} `
      }
   })
   const data = await authaxios.get(`${api}/casher/paid/${patient_id_Medical_Record}`)
   
   return {
      props: {
         patient:data.data,
       }, // will be passed to the page component as props
   }
}


export default function PaidPatient({patient}){
   const patientRadiology = patient['rad']
   const patientLabrotory = patient['lab']
   const patientpharma = patient['pharma']
   const ptientMRN = patient['info'].MRN

   const IdListRad = []
   const IdListLab = []
   const IdListpharma = []

   patientRadiology.map((data)=>(
      IdListRad.push(data.id)
   ))

    patientLabrotory.map((data)=>(
      IdListLab.push(data.id)
   ))

   patientpharma.map((data)=>(
      IdListpharma.push(data.id)
   ))
   const withOutDuplicateIdForRad = [...new Set(IdListRad)];
   const withOutDuplicateIdForLab = [...new Set(IdListLab)];
   const withOutDuplicateIdForPharma = [...new Set(IdListpharma)];
   const groupBy = keys => array =>
      array.reduce((objectsByKeyValue, obj) => {
         const value = keys.map(key => obj[key]).join('-');
         objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
         return objectsByKeyValue;
   }, {});

   const groupById = groupBy(['id']);
   const PatientDataRadGroupById = groupById(patientRadiology)
   const PatientDatalabGroupById = groupById(patientLabrotory)
   const PatientDatapharmaGroupById = groupById(patientpharma)

   return(
      <div className={styles.home}>
         <SideNavbar mrn={ptientMRN}/>
         <div className={styles.homeContainer}>
            <Header />
            <Container >
               <div className="bg-white border my-3 rounded">
                  <Row className="p-3">
                     <Col md={4} className="text-center">
                        <p>MRN</p>
                        <p>{patient['info'].MRN}</p>
                     </Col>
                     <Col md={4} className="text-center">
                        <p>Name</p>
                        <p>{patient['info'].Name}</p>
                     </Col>
                     <Col md={4} className="text-center">
                        <p>Age</p>
                        <p>{patient['info'].DateOfBirth}</p>
                     </Col>
                  </Row>

                  <Row className="p-3">

                     <Col md={4} className="text-center">
                        <p>Gender</p>
                        <p>{patient['info'].Gender}</p>
                     </Col>

                     <Col md={4} className="text-center">
                        <p>Phone Number</p>
                        <p>{patient['info'].Phonenumber}</p>
                     </Col>

                     <Col md={4} className="text-center">
                        <p>Occupation</p>
                        <p>{patient['info'].Occupation}</p>
                     </Col>
                  </Row>
               </div>
              <div className="bg-white p-3 my-3">
                     <div>
                        <div>
                           <h5 className="text-center text-primary fs-4">Radiology</h5>
                        </div>
                     </div>

                     {withOutDuplicateIdForRad.map((number,id)=>(
                        <div className="bg-light border my-5 rounded px-3">
                           <Row className="px-5 py-3">
                              <Col md={6} className="">
                                 <h5>Created By</h5>
                                 <p>{PatientDataRadGroupById[number][0].CreatedBy}</p>
                              </Col>

                              <Col md={6} className="">
                                 <h5>Created Date</h5>
                                 <p>{moment(PatientDataRadGroupById[number][0].Requested_Date).utc().format('YYYY-MM-DD')}</p>
                              </Col>
                           </Row>

                           <div className="bg-white border m-3 rounded">
                              <Row className="p-3">
                                         <Col md={3}>
                                             <h5>Request</h5>
                              
                                         </Col>
                                         <Col md={2}>
                                             <h5>Price</h5>
                              
                                          </Col>

                                          <Col md={2}>
                                             <h5>Clinic</h5>
                              
                                          </Col>


                                          <Col md={3}>
                                             <h5>Approved By</h5>
                                 
                                          </Col>

                                          <Col md={2}>
                                             <h5>Approved Date</h5>
                                          </Col>
                                       </Row>
                                 <div className="bg-light border mx-3 rounded">
                                    {PatientDataRadGroupById[number].map((data,index)=>(
                                       <Row className="p-3">
                                         <Col md={3}>
                  
                                             <p>{data.Request}</p>
                                         </Col>
                                         <Col md={2}>
                  
                                             <p>{data.Price}</p>
                                          </Col>

                                          <Col md={2}>
                  
                                             <p>{data.Clinic}</p>
                                          </Col>


                                          <Col md={3}>
                        
                                             <p>{data.ApprovedBy}</p>
                                          </Col>

                                          <Col md={2}>
                        
                                             <p>{moment(data.ApprovedDate).utc().format('YYYY-MM-DD')}</p>
                                          </Col>
                                       </Row>
                                    ))}
                                 </div>
                           </div>
                        </div>
                     ))}
                  </div>  
               <div className="bg-white p-3 my-3">
                     <div>
                        <h5 className="text-center text-primary fs-4">Laboratory</h5>
                     </div>
                     
                     {withOutDuplicateIdForLab.map((number,id)=>(
                        <div className="bg-light border my-3 rounded px-3">
                           <Row className="px-5 py-3">
                              <Col md={6} className="">
                                 <h5>Created By</h5>
                                 <p>{PatientDatalabGroupById[number][0].CreatedBy}</p>
                              </Col>

                              <Col md={6} className="">
                                 <h5>Created Date</h5>
                                 <p>{moment(PatientDatalabGroupById[number][0].Requested_Date).utc().format('YYYY-MM-DD')}</p>
                              </Col>
                           </Row>
                        
                           <div className="bg-white border my-5 rounded px-3">
                              <Row className="p-3">
                                        <Col md={6} >
                                            <h5>Panel</h5>
                  
                                        </Col>

                                        <Col md={6} >
                                            <h5>Panel</h5>
                        
                                        </Col>
                                    </Row>
                              <div className="bg-light border mx-3 mb-3 rounded px-3">
                                 {PatientDatalabGroupById[number].map((data,index)=>(
                                    <Row className="py-3">
                                        <Col md={6} >
                     
                                            <p>{data.Panel}</p>
                                        </Col>

                                        <Col md={6} >
                     
                                            <p>{data.Panel_Price}</p>
                                        </Col>
                                    </Row>
                              ))}
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
       

            <div className="bg-white p-3 my-3">
                     <div>
                        <h5 className="text-center text-primary fs-4">Pharmacy</h5>
                     </div>
                     
                     {withOutDuplicateIdForPharma.map((number,id)=>(
                        <div className="bg-light border my-5 rounded px-3">
                           <Row className="px-5 py-3">
                              <Col md={6} className="">
                                 <h5>Created By</h5>
                                 <p>{PatientDatapharmaGroupById[number][0].CreatedBy}</p>
                              </Col>

                              <Col md={6} className="">
                                 <h5>Created Date</h5>
                                 <p>{moment(PatientDatapharmaGroupById[number][0].Requested_Date).utc().format('YYYY-MM-DD')}</p>
                              </Col>
                           </Row>

                           <div className="bg-white border my-5 rounded">
                              <Row className="p-3">
                                        <Col md={6} >
                                            <h5>Medication</h5>
            
                                        </Col>
                                        <Col md={6}>
                                          <h5>Price</h5>
      
                                        </Col>
                                    </Row>
                              <div className="bg-light border mx-3 mb-3 rounded">  
                                 {PatientDatapharmaGroupById[number].map((data,index)=>(
                                    <Row className="p-3">
                                        <Col md={6} >
      
                                            <p>{data.Medication}</p>
                                        </Col>
                                        <Col md={6}>

                                            <p>{data.Price}</p>
                                        </Col>
                                    </Row>
                                 ))}
                              </div>
                              
                           </div>
                        </div>
                     ))}
                  </div>
            </Container>
         </div>
      </div>
   )  
}