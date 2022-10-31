import { useRef, useState } from "react"
import { ToggLable } from "./Toggeable"

export const NoteForm = ({addNote, handleLogOut}) => {
  const [newNote, setNewNote] = useState('')
  const toggLableRef = useRef()

  const handleChange = (e) => {
    setNewNote(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const noteObject = {
      content: newNote,
      important: Math.random() > 0.5
    }

    addNote(noteObject)
    setNewNote('')
    toggLableRef.current.toggleVisibility()
  }

  return (
    <ToggLable buttonLabel='New Note' ref={toggLableRef}>
      <h3>Create a new note</h3>
      <form onSubmit={handleSubmit}>
        <input
          value={newNote}
          onChange={handleChange}
          placeholder='Write your note'
        />
        <button type='submit'>Save</button>
      </form>
      <div>
        <button onClick={handleLogOut}>Log out</button>
      </div>
    </ToggLable>
  )
}
