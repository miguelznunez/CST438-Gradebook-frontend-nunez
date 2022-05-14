import React  from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Grid from '@mui/material/Grid';
import {DataGrid} from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import Cookies from 'js-cookie';
import {SERVER_URL} from '../constants.js';

// NOTE:  for OAuth security, http request must have
//   credentials: 'include' 
//

//  required properties -  assignment
//  
//  NOTE: because Gradebook is invoked via <Link> in Assignment.js components
//  properties are passed as attributes of props.location 
//
class Gradebook extends React.Component {
    constructor(props) {
      super(props);
      console.log("Gradebook.cnstr "+ JSON.stringify(props.location));
      this.state = {  grades :  [] };
    } 
    
     componentDidMount() {
      this.fetchGrades();
    }
 
    fetchGrades = () => {
      console.log("Gradebook.fetchGrades");
      const token = Cookies.get('XSRF-TOKEN');
      fetch(`${SERVER_URL}/gradebook/${this.props.location.assignment.assignmentId}`, 
        {  
          method: 'GET', 
          headers: { 'X-XSRF-TOKEN': token }
        } )
      .then((response) => response.json()) 
      .then((responseData) => { 
        if (Array.isArray(responseData.grades)) {
          // add attribute "id" to each row. Required for DataGrid,  id is index of row (i.e. 0, 1, 2, ...)  
          this.setState({ 
            grades: responseData.grades.map((r,index) => {
                  return {id:index, ...r};
            })
          });
        } else {
          toast.error("Fetch failed.", {
            position: toast.POSITION.BOTTOM_LEFT
          });
        }        
      })
      .catch(err => {
        toast.error("Fetch failed.", {
            position: toast.POSITION.BOTTOM_LEFT
          });
          console.error(err); 
      })
    }
  
    // when submit button pressed, send updated grades to back end 
    //  and then fetch the new grades.
    handleSubmit = ( ) => {
      console.log("Gradebook.handleSubmit");
      const token = Cookies.get('XSRF-TOKEN');
      
      fetch(`${SERVER_URL}/gradebook/${this.props.location.assignment.assignmentId}` , 
          {  
            method: 'PUT', 
            headers: { 'Content-Type': 'application/json',
                       'X-XSRF-TOKEN': token }, 
            body: JSON.stringify({assignmentId:this.props.location.assignment.assignmentId,  grades: this.state.grades})
          } )
      .then(res => {
          if (res.ok) {
            toast.success("Grades successfully updated", {
            position: toast.POSITION.BOTTOM_LEFT
            });
            this.fetchGrades();
          } else {
            toast.error("Grade updated failed", {
            position: toast.POSITION.BOTTOM_LEFT
            });
            console.error('Put http status =' + res.status);
      }})
        .catch(err => {
          toast.error("Grade updated failed", {
            position: toast.POSITION.BOTTOM_LEFT
          });
          console.error(err);
        });
   };        
    
    // when user has entered a new grade, update the state
    //  id    - index of row of grade change
    //  props - contains the new grade
    handleEditCellChange = ({ id, field, props }) => {
       console.log("edit cell change id:"+id+" field:"+field+" value:"+props.value);
       const newgrades = this.state.grades.map(r => {
         if (r.id === id){
           return {...r, [field]:props.value};
         } else {
           return {...r};
         }
       });
       this.setState({grades: newgrades});
     };

    handleCellEditCommit = (e) => {
      console.log("handleCellEditCommit "+JSON.stringify(e));
      const newgrades= this.state.grades.map(r => {
        //console.log(r.id+"   "+e.id);
        if (r.id === e.id) {
          return {...r, [e.field]:e.value};
        } else {
          return {...r};
        }
      });
      this.setState({grades: newgrades});
    };
 
    render() {
       const columns = [
        { field: 'name', headerName: 'Name', width: 250 },
        { field: 'email', headerName: 'Email', width: 250},
        { field: 'grade', headerName: 'Grade', width: 150 , editable:true}
        ];
        
        const assignment = this.props.location.assignment;
      
        return(
            <div className="App">
              <Grid container>
                <Grid item align="left">
                   <h4>Assignment: {assignment.assignmentName}</h4>
                   <h4>Course: {assignment.courseTitle}</h4>                   
                </Grid>
              </Grid>
              <div style={{width:'100%'}}>
                For DEBUG:  display state.
                {JSON.stringify(this.state)}
              </div>
              <div style={{ height: 400, width: '100%' }}>
                <DataGrid rows={this.state.grades} columns={columns} onCellEditCommit={this.handleCellEditCommit}  />
                <Button variant="outlined" color="primary" style={{margin: 10}} onClick={this.handleSubmit} >
                   Submit
                </Button>
              </div>
              <ToastContainer autoClose={1500} />   
            </div>
            ); 
        };
}

export default Gradebook;