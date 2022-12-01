import img from "../Images/user.avif";

export default function Users({name ,  uid , event , message ,  time , newEvent}) {
  
  return (
    <div onClick={
      ()=>{
      event(uid , name)
      newEvent(name)
      }
    } 
      className="flex flex-row w-[22vw] items-center justify-around border-b-2"
    >
      <div className="w-[20%] py-6">
        <img className="h-12 w-12 rounded-full" src={img} alt=""/>
      </div>
      <div className="w-[60%] py-6">
        <div className="mb-2 font-bold select-none">{name}</div>
        <div className="text-sm select-none">{message}</div>
      </div>
      <div className="w-[20%] py-6 text-[#a6b4bf] text-sm select-none">
        {time}
      </div>
    </div>
  )
}