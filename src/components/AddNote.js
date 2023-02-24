import React, { useState,useContext } from 'react'
import noteContext from '../context/notes/noteContext';


export const AddNote = () => {
    const context=useContext( noteContext);
    const{addNote}=context;
    const [note, setnote] = useState({title: " ",description:" ",tag:" "})
    const handleClick=(e)=>{
        e.preventDefault();
        addNote(note.title,note.description,note.tag)
        setnote({title: " ",description:" ",tag:""})
    }
    const onchange=(e)=>{
        setnote({...note,[e.target.name]:e.target.value})
    }
  return (
    <div className="container my-3">
    <h2>Add a Note</h2>
    <form className="my-3" >
      <div className="mb-3">
        <label htmlFor="title" className="form-label">Title</label>
        <input type="text" className="form-control" id="title" name="title" aria-describedby="emailHelp" 
        onChange={onchange} value={note.title} minLength={5} required/>
        <div id="emailHelp" className="form-text">Entre a Tag.</div>
      </div>
      <div className="mb-3">
        <label htmlFor="description" className="form-label">Description</label>
        <input type="text" className="form-control" id="description" name="description" onChange={onchange} value={note.description} minLength={5} required/>
      </div>
      <div className="mb-3">
        <label htmlFor="tag" className="form-label">Tag</label>
        <input type="text" className="form-control" id="tag" name="tag" onChange={onchange} value={note.tag} minLength={5} required/>
      </div>
      <button disabled={note.title.length<5 || note.description.length<5 || note.tag.length<3} type="submit" className="btn btn-primary" onClick={handleClick}>Add Note</button>
    </form>
  </div>
  )
}
