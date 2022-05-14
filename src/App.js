import './App.css';
import axios from "axios";
import Button from "@material-ui/core/Button";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import {useEffect, useState} from "react";
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import {makeStyles} from '@material-ui/core/styles';
import {CircularProgress, Grid, Typography} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import {toast} from 'react-toastify';


import 'react-toastify/dist/ReactToastify.css';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection:"column",
    margin: theme.spacing(5)
  },
  buttonContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    margin: theme.spacing(5)
  },
  dataGridContainer:{
    width:"100%",
  },
  paper: {
    width: '30%',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  form: {
    width: '100%',   
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));


function App() {
  toast.configure();
  const classes = useStyles();
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [bookingsData,setbookingsData]=useState({});
  const [itemData, setItemData] = useState({
    hotelName:'',
    hotelLocation:'',
    bookingPrice:'',
    numberOfPersons:'',
    checkIn:'',
    checkOut:'',
    youtubeUrl:''

  })
  const [count,setCount]=useState(0);

  useEffect(() => {
    axios.get('http://localhost:8080/bookings')
        .then(response => {
          const {data}=response;
          setbookingsData(data);
        })
        .catch((error) => {
          console.log('Error:',error);
        })
  },[count])

  const handleItemData = () => {
    axios.post("http://localhost:8080/bookings",itemData)
        .then(res => {
          setbookingsData([...bookingsData,itemData]);
          setCount(count+1);
          toast.success(`Booking added successfully`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
          });
        })
        .catch(err => console.log('Error',err))
  }
  const handleDeleteItem = (row) => {
    const item=(bookingsData.find(row2 => row2.id===row.id));
    axios.delete(`http://localhost:8080/bookings/${item.hotelName}`)
        .then(() => {
          console.log('Deleted item!');
          toast.success(`Booking deleted successfully`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
          });
        })
        .catch((error) => {
          console.log('Error:',error);

        })
  }

  const handleModalOpen = () => {
    setIsModalOpened(true);

  };

  const handleModalClose = () => {
    setIsModalOpened(false);
  };

  const handleInputChange = (e) => {
    setItemData({...itemData, [e.target.name]:e.target.value});
  }


  const handleAddItem = () => {
    setItemData({
      hotelName:'',
      hotelLocation:'',
      bookingPrice:'',
      numberOfPersons:'',
      checkIn:'',
      checkOut:'',
      youtubeUrl:''
    })
    handleModalOpen();
  }
  return (
  
      <div  className={classes.container}>
        <h1 variant="h3" component="h2">
          My Travelling Journal
        </h1>
        
        <div className={classes.buttonContainer}>

          <Button
              variant="contained"
              color="primary"
              className={'my-add-button'}
              startIcon={<AddCircleOutlineIcon/>}
              onClick={handleAddItem}
          >
            Add booking
          </Button>
        </div>
    
        <div class = "container">
        <div class="row gy-3 my-3">
      <> {bookingsData ? Object.values(bookingsData).map((booking) => (  
          <div class="col-md-3">
          <div class="card">
            <iframe
                          src={"https://www.youtube.com/embed/"+ booking.youtubeUrl.split('=')[1]  } 
                          frameborder="0"
                          allow="autoplay; encrypted-media"
                          allowfullscreen
                          title="video"
                        /> 

            <div class="card-body">
              <h5 class="card-title">{booking.hotelLocation}</h5>
              <p class="card-text"> <strong> Hotel: </strong> {booking.hotelName} <br></br>
                                  <strong> Booking Price: </strong> {booking.bookingPrice}$ <br></br>
                                  <strong> Number of Persons: </strong> {booking.numberOfPersons}   <br></br> 
                                  <strong> Check In Date: </strong> {booking.checkIn} <br></br>
                                  <strong>Check Out Date: </strong> {booking.checkOut} <br></br>
                        </p>
              <a href="#" class="btn btn-primary" onClick={() => handleDeleteItem(booking)} >Detele memory </a>
            </div>
          </div>

          </div>
           )): <CircularProgress />}
        </> </div>
      </div>
    
    
     
      <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={isModalOpened}
            onClose={handleModalClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
        >
          <Fade in={isModalOpened}>
            <div className={classes.paper}>
              <div className="modal-header">Some info about your new adventure</div>
              <form className={classes.form} noValidate>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="hotelName"
                        label="Hotel Name"
                        name="hotelName"
                        value={itemData.hotelName}
                        onChange={handleInputChange}
                        autoFocus
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="hotelLocation"
                        label="Hotel Location"
                        name="hotelLocation"
                        value={itemData.hotelLocation}
                        onChange={handleInputChange}
                        autoFocus
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="bookingPrice"
                        label="Booking Price"
                        name="bookingPrice"
                        value={itemData.bookingPrice}
                        onChange={handleInputChange}
                        autoFocus
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="numberOfPersons"
                        label="Number of Persons"
                        name="numberOfPersons"
                        value={itemData.numberOfPersons}
                        onChange={handleInputChange}
                        autoFocus
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="checkIn"
                        label="Check In"
                        name="checkIn"
                        value={itemData.checkIn}
                        onChange={handleInputChange}
                        autoFocus
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="checkOut"
                        label="Check Out"
                        name="checkOut"
                        value={itemData.checkOut}
                        onChange={handleInputChange}
                        autoFocus
                    />
                  </Grid>

                  <Grid item xs={12} direction={"row"} justify={"center"} alignItems={"center"}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            onClick={handleItemData}
                        >
                          Add booking
                        </Button>

                  </Grid>


                </Grid>

              </form>
            </div>
          </Fade>
        </Modal>     
      </div>
  );
}

export default App;
