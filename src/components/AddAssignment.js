import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

// NOTE:  for OAuth security, http request must have
//   credentials: 'include' 
//

//  required properties -  assignment
//  
//  NOTE: because Gradebook is invoked via <Link> in Assignment.js components
//  properties are passed as attributes of props.location 
//
class AddAssignment extends React.Component {

   constructor(props) {
      super(props);
      this.state = {open: false, assignment:{ courseId: "", assignmentName: "", dueDate: ""}};
    };
    
    handleClickOpen = () => {
      this.setState( {open:true} );
    };

    handleClose = () => {
      this.setState( {open:false} );
    };

    handleChangeCourseId = (event) => {
     this.setState( {assignment: { ...this.state.assignment, courseId: event.target.value }} )
    }

    handleChangeAssignmentName = (event) => {
     this.setState(  {assignment:{ ...this.state.assignment, assignmentName: event.target.value }} );
    }

    handleChangeDueDate = (event) => {
     this.setState(  {assignment:{ ...this.state.assignment, dueDate: event.target.value }} );
    }

  // Save assignment and close modal form
    handleAdd = () => {
       this.props.addAssignment(this.state.assignment);
       this.handleClose();
    }

    render()  { 
      return (
          <div>
            <Button variant="outlined" color="primary" style={{margin: 10}} onClick={this.handleClickOpen}>
              Add Assignment
            </Button>
            <Dialog open={this.state.open} onClose={this.handleClose}>
                <DialogTitle>Add Assignment</DialogTitle>
                <DialogContent  style={{paddingTop: 20, display: 'flex', gap: '10px'}} >
                  <TextField autoFocus fullWidth label="Course ID" name="courseId" onChange={this.handleChangeCourseId}  /> 
                  <TextField autoFocus fullWidth label="Assignement name" name="assignmentName" onChange={this.handleChangeAssignmentName}  /> 
                  <TextField autoFocus fullWidth label="Due date" name="dueDate" onChange={this.handleChangeDueDate}  /> 
                </DialogContent>
                <DialogActions>
                  <Button color="secondary" onClick={this.handleClose}>Cancel</Button>
                  <Button color="primary" onClick={this.handleAdd}>Add</Button>
                </DialogActions>
              </Dialog>      
          </div>
      ); 
    }
}

// required property:  addCourse is a function to call to perform the Add action
AddAssignment.propTypes = {
  addAssignment : PropTypes.func.isRequired
}

export default AddAssignment;