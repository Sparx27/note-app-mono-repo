import React, { useEffect, useState } from 'react'
import { getAll, create, update, setToken } from './services/notes'
import Notification from './components/Notification'
import Note from './components/Note'
import { login } from './services/login'
import { LoginForm } from './components/LoginForm'
import { NoteForm } from './components/NoteForm'

export default function App () {
  const [notes, setNotes] = useState([])
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      setToken(user.token)
    }
  }, [])

  const addNote = (noteObject) => {
  create(noteObject)
    .then(returnedNote => {
      setNotes(notes.concat(returnedNote))
    })
  }

  const toggleImportanceOf = (id) => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }
  
    update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      .catch(error => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)   
      })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    
    try {
      const user = await login({
        username, // Como el nombre de la propiedad es igual al de los estados, permite un shorthand
        password
      })
      
      window.localStorage.setItem(
        'loggedNoteAppUser', JSON.stringify(user)
      )

      setToken(user.token)

      setUser(user)
      setUsername('')
      setPassword('')
    } catch (error) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogOut = () => {
    setUser(null)
    setToken(user.token)
    window.localStorage.removeItem('loggedNoteAppUser')
  }

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important)

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />

      {
        user
          ? <NoteForm
              addNote={addNote}
              handleLogOut={handleLogOut}
            />
          : <LoginForm
              username={username}
              password={password}
              handleUsernameChange={ ({target}) => setUsername(target.value) }
              handlePasswordChange={ ({target}) => setPassword(target.value) }
              handleSubmit={handleLogin}
            />
      }

      <br />
      <div>
        <button onClick={() => setShowAll(!showAll)}>Show {showAll ? 'important' : 'all'}</button>
      </div>

      <ul>
        {notesToShow.map((note, i) => 
          <Note
            key={i}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)} 
          />
        )}
      </ul>
    </div>
  )
}