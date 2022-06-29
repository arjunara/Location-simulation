import { useEffect, useState} from 'react';
import { Tooltip } from '@mui/material';
// import locationData from './locData.json'
// import Apicall from '../src/helper'
import ClockLoader from "react-spinners/ClockLoader";
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import Swal from 'sweetalert2'
import './App.css';
import axios from 'axios';

const apiStatusConstants = {
  initial: 'INITIAL',
  inprogress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE'
}


const getLogin = async()=> {
  const loginUrl = `${process.env.REACT_APP_LOCAL_BASEURL}/asrs/api/login`
  const userData = {
    "username": "admin",
    "password": "admin"
}
  try{
    const apiData = await axios.post(loginUrl, userData).then((res)=>res.data )
    localStorage.setItem('accessToken', JSON.stringify(apiData.accessToken))
    console.log("token saved")
    return apiData.accessToken
  }catch(err){
    console.log(err.message, err.response.data.error)
  }
}
if (JSON.parse(localStorage.getItem('accessToken'))===null){
  getLogin()
}


function App() {
  const [locObj, setLocList] = useState({locList: [], apiStatus: apiStatusConstants.initial, errMsg: ''})
  const [isLoading, setIsLoading] = useState(true)
  const [row_Left_div1Grid, setRow_Left_div1Grid] = useState([])
  const [row_Left_div2Grid, setRow_Left_div2Grid] = useState([])
  const [row_Right_div1Grid, setRow_Right_div1Grid] = useState([])
  const [row_Right_div2Grid, setRow_Right_div2Grid] = useState([])

  const [anchorEl, setAnchorEl] = useState(false);
  const open = Boolean(anchorEl)
  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
    console.log("-----", event.currentTarget)
  };
  const handleClose = () => {
    setAnchorEl(false);
  };

  // const {apiResonse, isLoading} = Apicall({
  //   method: 'get',
  //   url: `${process.env.REACT_APP_LOCAL_BASEURL}/asrs/api/login`,
  //   body: {
  //     "username": "admin",
  //     "password": "admin"
  //   }
  // })
  // if (apiResonse) localStorage.setItem("asrsToken", apiResonse.accessToken)
  // console.log("it is one time")
  
  const getLocations = async (token) => {
    const locUrl = `${process.env.REACT_APP_LOCAL_BASEURL}/asrs/api/report/location`
    if (!token) return ''
    else{
      try{
        const locRes = await axios.get(locUrl, { headers: {"Authorization" : `Bearer ${token}`}}).then((res)=> res.data.rows)
        let new_obj = {
          locList: [...locRes], apiStatus: apiStatusConstants.success, errMsg: ''
        }
        setLocList(new_obj)
        return locRes
      }catch(err){
        console.log(err.message)
        return err.message
      }
    }
  }
  const createGrid = (k=1)=>{ 
    console.log('---locationData', locObj)
    setIsLoading(false)
    const locationList = locObj.locList
    let row_1_left_division_1 = locObj.locList.filter((each, i) => {
      if (each.row === parseInt(k) && each.side === 'L' && each.deep <= 8 && each.column <= 23){
        console.log("sjdfll")
        return locObj.locList.sort((a, b)=> {
          if (a.column === b.column){
            return b.deep - a.deep
          }
          return a.column > b.column ? 1: -1
        })
      }
      return ''
    });
    
    let temp1=[]
      for (let i=0; i<8; i++){
        row_1_left_division_1.forEach(el =>{
          if (el.deep === 8 - i){
            return temp1.push(el)
          }
          return ""
        })
      }
    console.log("====temp1====", temp1)
    setRow_Left_div1Grid(temp1)

    let row_1_left_division_2 = locationList.filter((each, i) => {
      if (each.row === parseInt(k) && each.side === 'L' && each.column >= 24){
        return locationList.sort((a, b)=> {
          if (a.column === b.column){
            return b.deep - a.deep
          }
          return a.column > b.column ? 1: -1
        })
      }
      return ''
    });
  
      let temp2=[]
      for (let i=0; i<12; i++){
        row_1_left_division_2.forEach(el =>{
          if (el.deep === 12 - i){
            return temp2.push(el)
          }
          return ""
        })
      }
    console.log("====temp2=====", temp2)
    setRow_Left_div2Grid(temp2)

    let row_1_Right_division_3 = locationList.filter((each, i) => {
      if (each.row === parseInt(k) && each.side === 'R' && each.deep <= 6 && each.column <= 28){
        return locationList.sort((a, b)=> {
          if (a.column === b.column){
            return b.deep-a.deep
          }
          return a.column > b.column ? 1: -1
        })
      }
      return ''
    });
    let temp3 = []
    for (let i=0; i<6; i++){
      row_1_Right_division_3.forEach(el =>{
        if (el.deep === i+1){
          return temp3.push(el)
        }
        return ""
      })
    }
  console.log("====temp3=====", temp3)
  setRow_Right_div1Grid(temp3)

  let row_1_Right_division_4 = locationList.filter((each, i) => {
    if (each.row === parseInt(k) && each.side === 'R' && each.deep <= 9 && each.column > 28){
      return locationList.sort((a, b)=> {
        if (a.column === b.column){
          return b.deep-a.deep
        }
        return a.column > b.column ? 1: -1
      })
    }
    return ''
  });
  let temp4 = []
  for (let i=0; i<9; i++){
    row_1_Right_division_4.forEach(el =>{
      if (el.deep === i+1){
        return temp4.push(el)
      }
      return ""
    })
  }
  console.log("====temp4=====", temp4)
  setRow_Right_div2Grid(temp4)
  }
  const onClickRow1 = e => {
    setAnchorEl(false);
    createGrid(e.target.value)
  }
  const onClickRow2 = e => {
    setAnchorEl(false);
    createGrid(e.target.value)    //2
  }
  const onClickRow3 = e => {
    setAnchorEl(false);
    createGrid(e.target.value)    //3
  }
  const showAlert = (data)=>{
    let storedTime = new Date(data.storedAt)
    let dateFormat = storedTime.getDate()+'/'+(storedTime.getMonth()+1) + '/'+storedTime.getFullYear()
    let timeFormat = storedTime.getHours()+':'+storedTime.getMinutes()+':'+storedTime.getSeconds() + ':' + storedTime.getMilliseconds()
    Swal.fire({
      title:"Location Block Details",
      html: `<p><b>Pallet Barcode: </b><span>${data.barcode}</span></p>
      <p><b>Batch: </b><span>${data.custom1}</span>
      <p><b>Quantity: </b><span>${data.qty}</span>
      <p><b>Pallet Weight: </b><span>${data.weight}</span>
      <p><b>Stored At: </b><span>${dateFormat + '  ' + timeFormat}</span>`,
      icon: 'info'
    })
  }
  useEffect(()=>{
      const token = JSON.parse(localStorage.getItem('accessToken'))
      const callApi = async()=> {
        const temp6 = await getLocations(token)
        console.log('raw locations', temp6)
      }
      callApi()
  }, [])

  const renderLoader = ()=> {
    return (
      <div className='loader-container'>
        <ClockLoader color="#35258e" size={70} loading={isLoading} />      {/*  cssOverride={{ borderWidth: '12px'}}    */}
      </div>
    )
  }

  const renderResultView = ()=> {
    return (
      <>
      <div className='top-section'>
        <div className='side-text-container'>
          <p className='side-text'>Left<br/>side</p>
        </div>
        <div className='side_container'>
          <div className='division-1'>
            {row_Left_div1Grid.map((data, i)=> {
          
          return (
            
              <div key={"block-L" + data.locationid} className={data.barcode? "block filledBlock": "block"} onClick={()=> showAlert(data)}>
              <Tooltip title={data.barcode? "Barcode: " + data.barcode: "No Barcode"} arrow>
                <span >{data.deep}</span>
              </Tooltip>
            </div>
            
            
          )
        })}

            </div>
            <div className='division-2'>
            {row_Left_div2Grid.map((data, i)=> {
          
          return (
          <div key={"block-L" + data.locationid} className="block">
            <Tooltip title={data.barcode? data.barcode: "No Barcode"} arrow>
            <span >{data.deep}</span>
            </Tooltip>
          </div>
        )
      })}
            </div>
          </div>
      </div>
      <div className='col-num-container'>
        {[...Array(40)].map((data, i)=> {
          return (<div key={"col-num-L" + i+1} className={i===23? "col-num-block-left customStyle": "col-num-block-left"}>
            <span >{i+1}</span>
          </div>)
        })}
      </div>
      <h3 className='text-center'><b>Asile</b></h3>
      <div className='col-num-container' style={{display:'flex', marginLeft:'80px'}}>
        {[...Array(40)].map((data, i)=> {
          return (<div key={"col-num-R" + i+1} className={i===23? "col-num-block-right customStyle": "col-num-block-right"}>
            <span >{i+1}</span>
          </div>)
        })}
      </div>

      <div className='bottom-section'>
      <div className='side-text-container'>
          <p className='side-text' style={{marginLeft:'0px'}}>Right<br/>side</p>
        </div>
        <div className='side_container'>
          <div className='divion-3'>
            {row_Right_div1Grid.map((each, i)=> {
              return (
                <div key={"block-R-" + each.locationid} className={each.barcode? "block filledBlock": "block"}>
                  <Tooltip title={each.barcode? each.barcode: "No Barcode"} arrow>
                  <span>{each.deep}</span>
                  </Tooltip>
                </div>
              )
            })}
          </div>
          <div className='divion-4'>
            {row_Right_div2Grid.map((each, i)=> {
              return (
                <div key={"block-R" + each.locationid} className={each.barcode? "block filledBlock": "block"}>
                  <Tooltip title={each.barcode? each.barcode: "No Barcode"} arrow>
                  <span>{each.deep}</span>
                  </Tooltip>
                </div>
              )
            })}
          </div>
          </div>
      </div>
      </>
    )
  }
  return (
    <div className='app-container'>
      <div className='header-section'>
        <div className='hambergan-menu'>
        <Button
        id="demo-positioned-button"
        aria-controls={anchorEl ? 'demo-positioned-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={anchorEl ? 'true' : undefined}
        onClick={handleClickMenu}
      >
        <MenuOpenIcon fontSize='large'/>
      </Button>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
  
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={onClickRow1}>Ground Level (G-0)</MenuItem>
        <MenuItem onClick={onClickRow2}>First Level (G+1)</MenuItem>
        <MenuItem onClick={onClickRow3}>Second Level (G+2)</MenuItem>
      </Menu>
      {/* <button type="button" className='hamber-btn'>
            
            </button> */}
        </div>
        <div className='logo-container'>
        <img src={process.env.PUBLIC_URL+"img/Armstrong_logo.png"}  alt="brand logo" className='logo-img' />
        </div>
        {/* <div className='row-btn-container'>
          <button type='button' className='btn btn-sm btn-primary' value="1" onClick={onClickRow1}>Row-1</button>
          <button type='button' className='btn btn-sm btn-primary' value="2" onClick={onClickRow2}>Row-2</button>
          <button type='button' className='btn btn-sm btn-primary' value="3" onClick={onClickRow3}>Row-3</button>
        </div> */}
      </div>
      {isLoading ? renderLoader() : renderResultView()}
    </div>
  );
}

export default App;