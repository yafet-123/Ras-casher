import Pagination from 'react-bootstrap/Pagination';
import { useState,useEffect, useContext} from 'react'
import Image from 'next/image'
import axios from "axios";
import Link from "next/link";
import {AiOutlineArrowRight} from 'react-icons/ai';
import {AiOutlineDown} from 'react-icons/ai'
import {AiOutlineSearch} from 'react-icons/ai'
import Cookies from 'universal-cookie';
import { useRouter } from 'next/router'
import moment from 'moment';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import {AiOutlineEye} from 'react-icons/ai';

export default function DisplayPatient() {
	const [patients,setpatients] = useState([])
	const [searchValue, setsearchValue] = useState('')
	const [searchParameter, setsearchParameter] = useState(1)
	const [placeholder,setPlaceholder] = useState("")	
	const [getSearchValue,setgetSearchValue] = useState("")
	const handleSearch = async (e)=>{
		const cookies = new Cookies();
		const accesstoken = cookies.get('token')
		const apiURL = "https://hmsapiserver.herokuapp.com/api/v1"
		const authaxios = axios.create({
			baseURL : apiURL,
			headers :{
				Authorization : `Bearer ${accesstoken} `
			}
		})
		const oneData = await authaxios.post(`${apiURL}/search/`,{
			"searchName": getSearchValue,
   	 		"type": e
		})

		const objOneData = oneData.data
		if(Array.isArray(objOneData)){
			setpatients(objOneData)
		}else{
			const patient = []
			patient.push(objOneData)
			setpatients(patient)
		}
	
	}
	return(
			<div>
				<div className="container">
				    <div className="">
				    	<InputGroup className="p-3">
					        <Form.Control
					        	placeholder="Search"
					          	aria-label="Search"
					          	aria-describedby="basic-addon1"
					          	className="mx-1"
					          	valiue={getSearchValue}
								onChange={(e) => setgetSearchValue(e.target.value)}
					        />

					        <DropdownButton
						        title="Search"
						        id="input-group-dropdown-2"
						        align="end"
						        variant="primary"
						        className="text-lg-start text-uppercase "
						    >
						        	<Dropdown.Item onClick={()=> handleSearch(1)}>
						        		By MRN
						        	</Dropdown.Item>

						        	<Dropdown.Item onClick={()=> handleSearch(2)}>
						        		By Name
						        	</Dropdown.Item>

						        	<Dropdown.Item onClick={()=> handleSearch(3)}>
						        		By PhoneNumber
						        	</Dropdown.Item>

						        	<Dropdown.Item onClick={()=> handleSearch(4)}>
						        		By PreviousMRN
						        	</Dropdown.Item>
        					</DropdownButton>
					    </InputGroup>
				        <div id="no-more-tables">
				        	{ patients.length == 0 ? 
				        			<p className="text-center fst-italic fw-normal fs-5 text-secondary border bg-white m-3 p-2 rounded">No Patient Data</p> 
				        		:
					            <table className="table table-borderless col-md-12 cf">
					        		<thead className="cf bg-white">
					        			<tr>
					        				<th scope="col">MRN</th>
					        				<th scope="col">Full Name</th>
					        				<th scope="col">Gender</th>
					        				<th scope="col">Age</th>
					        				<th scope="col">Phone Number</th>
					        				<th scope="col">Regestration Date</th>
					        				<th scope="col">Created By</th>
					        				<th scope="col"></th>
					        			</tr>
					        		</thead>
					        		<tbody>
					        			{patients.map((data,index)=>(
						        			<tr key={index} className="bg-white p-3">
						        				<td data-title="MRN" scope="row" >{data.MRN}</td>
						        				<td data-title="Full Name" >{data.Name}</td>
						        				<td data-title="Gender" >{data.Gender}</td>
						        				<td data-title="Age" >{data.DateOfBirth}</td>
						        				<td data-title="Phone Number" >{data.PhoneNumber}</td>
						        				<td data-title="Regestration Date" >{moment(data.RegistrationDate).utc().format('YYYY-MM-DD')}</td>
						        				<td data-title="Created By" >{data.CreatedBy}</td>
						        				<td>
						        					<Link
														href={{pathname: `/casher/UnpaidPatient`, query:{ mrn: data.MRN }}}
													>	
														<a  
															className="btn btn-info"
														><AiOutlineEye /></a>
													</Link>
												</td>
						        			</tr>
					        			))}
					        		</tbody>
					        	</table>
					        }
				        </div>
				    </div>
				</div>
			</div>
	)
}