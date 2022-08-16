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
import moment from 'moment';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
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
	const data = await authaxios.get(`${api}/casher/${patient_id_Medical_Record}`)
	
  	return {
    	props: {
	    	patient:data.data,
	    }, // will be passed to the page component as props
	}
}


export default function CasherPayment({patient}){
	const router = useRouter();
	const PatientDataRad = patient['rad']
	const PatientDatalab = patient['lab']
	const PatientDatapharma = patient['pharma']
	const ptientMRN = patient['info'].MRN
	const [RequestId, setRequestId] =  useState([])
	const [RequestName, setRequestName] =  useState([])
	const [show3, setShow3] = useState(false);
	const [show1, setShow1] = useState(false);
	const [show2, setShow2] = useState(false);
  	const [PriceRad,setPriceRad] =  useState([])
  	const [PriceLab,setPriceLab] =  useState([])
  	const [Pricepharma,setPricepharma] =  useState([])
  	const handleClose = () => {
  		setShow1(false);
  		setShow2(false);
  		setShow3(false);
  		setRequestId([])
  		setPriceRad([])
  		setPricepharma([])
  		setPriceLab([])
  	}
  	const cookies = new Cookies();
    const accesstoken = cookies.get('token')
    const authaxios = axios.create({
        baseURL : api,
        headers :{
            Authorization : `Bearer ${accesstoken} `
        }
    })
    const IdListLab = []
    const IdListRad = []
    const IdListpharma = []

    PatientDatalab.map((data)=>(
		IdListLab.push(data.id)
	))

    PatientDatapharma.map((data)=>(
		IdListpharma.push(data.id)
	))

	PatientDataRad.map((data)=>(
		IdListRad.push(data.id)
	))
	const withOutDuplicateIdForLab = [...new Set(IdListLab)];
	const withOutDuplicateIdForRad = [...new Set(IdListRad)];
	const withOutDuplicateIdForPharma = [...new Set(IdListpharma)];
	const groupBy = keys => array =>
  		array.reduce((objectsByKeyValue, obj) => {
    		const value = keys.map(key => obj[key]).join('-');
    		objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    		return objectsByKeyValue;
  	}, {});

  	const groupById = groupBy(['id']);
  	const PatientDataRadGroupById = groupById(PatientDataRad)
  	const PatientDatalabGroupById = groupById(PatientDatalab)
  	const PatientDatapharmaGroupById = groupById(PatientDatapharma)

  	const handleShow1 = () => setShow1(true);
  	const handleShow2 = () => setShow2(true);
  	const handleShow3 = () => setShow3(true);
  	const [fullscreen, setFullscreen] = useState(true);
  	const handleAdditionForRad=(number)=>{
  		PatientDataRadGroupById[number].map((data)=>{
  			setPriceRad(PriceRad=>[...PriceRad, data.Price]);
  			setRequestId(RequestId=>[...RequestId,data.Requestid])
  		})	
  	}


  	const initialValue1 = 0;
  	const TotalPriceRad = PriceRad.reduce(
		  (previousValue, currentValue) => previousValue + currentValue,
		  initialValue1
	);

  	const handleAdditionForLab=(number)=>{
  		PatientDatalabGroupById[number].map((data)=>{
  			setPriceLab(PriceLab=>[...PriceLab, data.Price]);
  			setRequestId(RequestId=>[...RequestId,data.Requestid])
  		})	
  	}

  	const initialValue2 = 0;
	const TotalPriceLab = PriceLab.reduce(
		  (previousValue, currentValue) => previousValue + currentValue,
		  initialValue2
	);

	const handleAdditionForPharma=(number)=>{
  		PatientDatapharmaGroupById[number].map((data)=>{
  			setPricepharma(Pricepharma=>[...Pricepharma, data.Price]);
  			setRequestId(RequestId=>[...RequestId,data.Requestid])
  		})	
  	}

  	const initialValue3 = 0;
	const TotalPricePharma = Pricepharma.reduce(
		  (previousValue, currentValue) => previousValue + currentValue,
		  initialValue3
	);

	const onSubmitForRad = async(e)=>{
		e.preventDefault()
        await authaxios.patch(`${api}/casher/`,{
            RequestId:RequestId,
            "type":"Rad"
        }).then(function (response) {
            router.reload()
        }).catch(function (error) {
            console.log(error);
        });
	}

	const onSubmitForLab = async(e)=>{
		e.preventDefault()
        await authaxios.patch(`${api}/casher/`,{
            RequestId:RequestId,
            "type":"Lab"
        }).then(function (response) {
            router.reload()
        }).catch(function (error) {
            console.log(error);
        });
	}

	const [InvoiceItemId,setInvoiceItemId]=useState()
	const [InvoiceNumber,setInvoiceNumber]=useState()
	const [paidAmount,setpaidAmount] = useState()
	console.log(InvoiceNumber)
	const onSubmitForPharma = async(e)=>{
		e.preventDefault()
		setpaidAmount(TotalPricePharma)
        await authaxios.patch(`${api}/casher/`,{
            "type":"Pharma",
            InvoiceItemId:parseInt(InvoiceItemId),
            InvoiceNumber:parseInt(InvoiceNumber),
            paidAmount:parseInt(paidAmount)
        }).then(function (response) {
        	console.log(response)
            router.reload()
        }).catch(function (error) {
            console.log(error);
        });
	}
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
										{PatientDataRadGroupById[number].map((data,index)=>(
				                     		<Row className="p-3">
							                    <Col md={6}>
							                        <h5>Request</h5>
							                        <p>{data.Request}</p>
							                    </Col>
							                    <Col md={6}>
							                        <h5>Price</h5>
							                        <p>{data.Price}</p>
							                   	</Col>
				                     		</Row>
										))}

										<button type="btn" className="btn btn-primary mb-3 mx-3" onClick={()=>{
											handleShow2()
											handleAdditionForRad(number)
										}}
										>
											calculate Total
										</button>
									</div>
								</div>
							))}
						</div>

						<div className="bg-white p-3 my-3">
							<div>
								<h5 className="text-center text-primary fs-4">Laboratory</h5>
							</div>
							
							{withOutDuplicateIdForLab.map((number,id)=>(
								<div className="bg-light border my-5 rounded px-3">
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
										{PatientDatalabGroupById[number].map((data,index)=>(
								            <Row className="p-3">
								                <Col md={6} >
								                    <h5>Panel</h5>
								                    <p>{data.Panel}</p>
								                </Col>
								                <Col md={6}>
								            <h5>Price</h5>
								                    <p>{data.Price}</p>
								                </Col>
								            </Row>
										))}

								<button type="btn" className="btn btn-primary mb-3 mx-3" onClick={()=>{
											handleShow1()
											handleAdditionForLab(number)
										}}
										>
											calculate Total
										</button>
									
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

									<div className="bg-white border my-5 rounded px-3">
										{PatientDatapharmaGroupById[number].map((data,index)=>(
								            <Row className="p-3">
								                <Col md={6} >
								                    <h5>Medication</h5>
								                    <p>{data.Medication}</p>
								                </Col>
								                <Col md={6}>
								            		<h5>Price</h5>
								                    <p>{data.Price}</p>
								                </Col>
								            </Row>
										))}
										
										<button type="btn" className="btn btn-primary mb-3 mx-3" onClick={()=>{
											handleShow3()
											handleAdditionForPharma(number)
											setInvoiceNumber(number)
										}}
										>
											calculate Total
										</button>
									</div>
								</div>
							))}
						</div>
						<Modal size="lg" show={show2} onHide={handleClose} dialogClassName="modal-90w">
							<Modal.Header closeButton>
								<Modal.Title>Total Price</Modal.Title>
							</Modal.Header>
							<Modal.Body>
								The Total amount of the Price is {TotalPriceRad}
							</Modal.Body>
							<Modal.Footer>
								<Button onClick={onSubmitForRad}>
									Paid
								</Button>
								<Button variant="secondary" onClick={handleClose}>
									Cancel
								</Button>
							</Modal.Footer>
						</Modal>

						<Modal size="lg" show={show1} onHide={handleClose} dialogClassName="modal-90w" aria-labelledby="example-custom-modal-styling-title">
							<Modal.Header closeButton>
								<Modal.Title>Total Price</Modal.Title>
							</Modal.Header>
							<Modal.Body>
								The Total amount of the Price is {TotalPriceLab}
							</Modal.Body>
							<Modal.Footer>
								<Button onClick={onSubmitForLab}>
									Paid
								</Button>
								<Button variant="secondary" onClick={handleClose}>
									Cancel
								</Button>
							</Modal.Footer>
						</Modal>

						<Modal size="lg" show={show3} onHide={handleClose} dialogClassName="modal-90w" aria-labelledby="example-custom-modal-styling-title">
							<Modal.Header closeButton>
								<Modal.Title>Total Price</Modal.Title>
							</Modal.Header>
							<Modal.Body>
								The Total amount of the Price is {TotalPricePharma}
								<Row>
									<Col sm>
				                     	<FloatingLabel controlId="floatingInput" label="InvoiceItemId">
				                         	<Form.Control 
				                           		type="text" 
				                           		placeholder="Invoice Item Id" 
				                           		value = {InvoiceItemId}
				                           		onChange={(e) => setInvoiceItemId(e.target.value)}
				                        	/>
				                      	</FloatingLabel>
                  					</Col>
                  				</Row>
							</Modal.Body>
							<Modal.Footer>
								<Button onClick={onSubmitForPharma}>
									Paid
								</Button>
								<Button variant="secondary" onClick={handleClose}>
									Cancel
								</Button>
							</Modal.Footer>
						</Modal>

							
				</Container>
			</div>
		</div>
	)	
}





