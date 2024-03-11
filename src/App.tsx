import { useEffect, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

import { makeServer } from "./api/server"
import { getAllMessages } from './api/getAllMessages'
import { updateLabel } from './api/updateLabel'

makeServer()

const keyMap = {
  SPAM: "1",
  OK: "2",
  HARM: "3"
};

export const App: React.FC = () => {
  const [checkMessages, setCheckMessages] = useState<Array<{ id: number, text: string }>>([])
  const [currentMessage, setCurrentMessage] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  


  useEffect(() => {
    getAllMessages()
      .then((json) => {
        setCheckMessages(json)
        setIsLoading(false)
      })
  }, [])


  const updateMessageLabel = (id: number, label: number) => {
    updateLabel(id, label)
    setCurrentMessage(currentMessage + 1)
    console.log(currentMessage);
    
  }

  useHotkeys(keyMap.SPAM, () => updateMessageLabel(currentMessage, 100))
  useHotkeys(keyMap.OK, () => updateMessageLabel(currentMessage, 0))
  useHotkeys(keyMap.HARM, () => updateMessageLabel(currentMessage, 200))

  if (isLoading) { 
    return (
      <main className="container">
        <article style={{marginTop: "25vh", textAlign: "center"}}>
        <div>Loading...</div>
        </article>
  </main>
  ) 
}

  return (
    <main className="container">
      <article key={currentMessage} style={{marginTop: "25vh", textAlign: "center"}}>
        <header>{checkMessages[currentMessage].id} / {checkMessages.length}</header>
        {checkMessages[currentMessage].text}
        <footer>
          <div className="grid">
            <button type="button" style={{ backgroundColor: '#7d2424' }} onClick={() => updateMessageLabel(currentMessage, 100)}>[1] Spam</button>
            <button type="button" style={{ backgroundColor: '#2f6f1b' }} onClick={() => updateMessageLabel(currentMessage, 0)}>[2] OK</button>
            <button type="button" style={{ backgroundColor: '#a95025' }} onClick={() => updateMessageLabel(currentMessage, 200)}>[3] Harm</button>
          </div>
        </footer>
      </article>
      </main>
  )
}
