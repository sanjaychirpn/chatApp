import ChatBox from "./Components/ChatBox";
import Container from "./Components/Container";
import UserChats from "./Components/UserChats";
import UserPanel from "./Components/UserPanel";
import { signInAnonymously, updateProfile } from "firebase/auth";
import { Auth, Db } from "./firebase.js";
import { useEffect, useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { useContext } from "react";
import { Context } from "./Context/MyContext"

function App() {
  const [ userName , setUserName ] = useState("")
  const MyContext = useContext(Context);

  function getUserName(data){
    setUserName(data)
  }

  useEffect(() => {
    signInAnonymously(Auth).then((resp) => {
      const displayName = "Admin"
      updateProfile(resp.user, {
        displayName: displayName
      })
      setDoc(doc(Db, "Admins", resp.user.uid), {
        uid: resp.user.uid,
        websiteURL: "http://localhost:3000",
        websiteId: "frontend_team",
        displayName: displayName
      }).catch((error) => {
        console.log(error)
      })
      MyContext.getUserId(resp.user.uid, displayName)       // Sending info into context
    }).catch((error) => {
      console.log(error)
    })
  }, [])

  return (
    <Container>
      <UserPanel />
      <UserChats getUser={getUserName}/>
      <ChatBox name={userName}/>
    </Container>
  )
}

export default App;