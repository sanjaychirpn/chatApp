import { BiSearchAlt } from "react-icons/bi";
import Users from "./Users";
import { getDocs, getDoc, setDoc, updateDoc, query, collection, where, doc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { Db } from "../firebase";
// Importing contexts
import { useContext, useEffect, useState } from "react";
import { Context } from "../Context/MyContext";
import { Chat } from "../Context/ChatContext"
// Importing contexts

export default function UserChats({getUser}) {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState([]);
  const MyContext = useContext(Context);
  const { getChat } = useContext(Chat);

  async function searchUser(event) {
    event.preventDefault();
    const user = event.target.value;
    const db = query(collection(Db, "Users"), where("displayName", "==", user), where("websiteId", "==", "frontend_team"));
    let arr = []
    await getDocs(db).then((res) => {
      res.forEach((doc) => {
        const newData = doc.data()
        arr.push(newData)
      })
      setSearch(arr)
    }).catch((err) => {
      console.log(err)
    })
  }

  async function clickHandler(userid, username) {

    const currentAdminId = MyContext.adminId;
    const currentAdminName = MyContext.adminName;

    if (currentAdminId !== null) {
      const inboxId = currentAdminId + userid
      getChat(currentAdminId, userid)
      try {
        const checkInbox = await getDoc(doc(Db, "Chats", inboxId))

        // check if doc exists or not
        if (!checkInbox.exists()) {
          // new doc created
          await setDoc(doc(Db, "Chats", inboxId), { messages: [] })
        }

        // Checking if doc exists or not
        const checkUserInfo = await getDoc(doc(Db, "inbox", currentAdminId))
        if (!checkUserInfo.exists()) {
          // if doc doesnt exists this will make one
          await setDoc(doc(Db, "inbox", currentAdminId), {})
          // this will update doc
          await updateDoc(doc(Db, "inbox", currentAdminId), {
            [inboxId + ".userInfo"]: {
              userId: userid,
              displayName: username
            },
            [inboxId + ".date"]: serverTimestamp()
          })
        }



        // Checking if doc exists or not
        const check = await getDoc(doc(Db, "inbox", userid));
        if (!check.exists()) {
          // if doc doesnt exists this will make one
          await setDoc(doc(Db, "inbox", userid), {})
          // this will update doc
          await updateDoc(doc(Db, "inbox", userid), {
            [inboxId + ".userInfo"]: {
              userId: currentAdminId,
              displayName: currentAdminName
            },
            [inboxId + ".date"]: serverTimestamp()
          })
        }
      } catch (error) {
        console.log(error)
      }
      // update doc that is created
    }
    return
  }

  useEffect(()=>{

    async function getData(){
      
      onSnapshot(doc(Db, "inbox" , MyContext.adminId) , (doc)=>{
        if(doc.data() !== undefined){
          setData(Object.entries(doc.data()))
        }else{
          setData([])
        }
      })
    }
    
    MyContext.adminId && getData()
  },[MyContext])

  return (
    <div className="flex flex-col w-[27vw]">
      <div className="h-[12vh] bg-[#e2eef7] flex items-center justify-center relative">
        <input className="w-[22vw] h-[5vh] pl-12 rounded-full outline-none ring-2 ring-[#d1dee9]" type="text" placeholder="Search..." onChange={searchUser} />
        <BiSearchAlt className="absolute top-[36%] left-[13%]" color="#a9bdcc" size={25} />
      </div>
      <div className="h-[88vh] bg-[#ebf4fb] flex flex-col  items-center overflow-y-auto">
        {
          (search.length !== 0)
          ?
            search.map((user) => {
              return <Users key={user?.uid} uid={user?.uid} name={user?.displayName} time={""} event={clickHandler} />
            })
          :
            <>
            </>
        }
        {
          (data.length !== 0 && search.length === 0)
          ?
            data.map((key) => {
              let time = `${new Date(key[1]?.date.seconds*1000).getHours()}:${new Date(key[1]?.date.seconds*1000).getMinutes()}`
              return <Users key={key[0]} uid={key[1]?.userInfo.userId} name={key[1]?.userName} message={key[1]?.lastMessage} time={time} newEvent={getUser} event={clickHandler} />
            })
          :
            <>
            </>
        }
      </div>
    </div>
  )
}