import React,{ useEffect, useState } from 'react'
import ScrollToBottom from "react-scroll-to-bottom";
import { CopyToClipboard } from "react-copy-to-clipboard";
function Chat({ socket, username, room }) {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const [users, setUsers] = useState([]);
    const [copyBtn,setCopyBtn] = useState(false)

    useEffect(() => {
        if(copyBtn){
          setTimeout(() => {
            setCopyBtn(false)
          }, 3000)
        }
      },[copyBtn])
    const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("chatMessage", messageData);
      //setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("roomUsers", (res) => {
        console.log("users-gpk: ");
        console.log(res)
        setUsers([res.users])
    })
  }, []);
  useEffect(() => {
      socket.on("message", (recData) => {
        console.log("receive message")
        console.log(recData)
        setMessageList((list) => [...list, recData]);
        //setUsers([recData.arr])
        //console.log(users)
        });
}, []);
    
  const tempData = () => {
      return ([...Array(20)].map((e, i) => (
        <p className='px-4 py-1 text-black dark:text-white font-semibold'><span className='px-2 text-green-500'>&#x25CF;</span>user1</p>
    )))
  }
    return (
        <>
            <div className='hidden sm:grid h-full w-full mx-4  
            grid grid-cols-1 sm:grid-cols-8 gap-4'>
                <div style={{height:'80vh'}} className=' sm:col-span-3 bg-white
                 rounded rounded-xl dark:bg-neutral-800 text-white dark:text-white'>
                    <div className='p-1 bg-blue-500 flex justify-between'>
                        <h3 className='font-semibold'>UserName: {username}</h3>
                        <h3 className='bg-blue-500 font-semibold'>Room ID: {room}</h3>
                    </div>
                        <h3 className='p-1 text-center text-black  dark:text-white uppercase font-4xl bg-gray-100 dark:bg-neutral-700'>Active Users</h3>
                        
                    <div style={{height: '85%'}} className="users overflow-auto">
                            <div className=' '>
                                {/* { tempData()} */}
                            </div>
                            
                            {
                            users.map((u) => {
                                return u.map(user => {
                                    console.log("u:")
                                    console.log(user);
                                    return (
                                        <p className='px-4 py-1 text-black dark:text-white font-semibold'><span className='px-2 text-green-500'>&#x25CF;</span>{user?.username}</p>   
                                )
                                })
                                }
                            )}
                    </div>
                </div>
                {/* Chat body  style={{height:'72%'}}*/}
                <div style={{height: '80vh'}}  className=' sm:col-span-5 bg-white rounded rounded-xl dark:bg-neutral-800'>
                        <div style={{height:'8%'}}  className='flex justify-between items-center font-semibold text-center text-white bg-blue-500 p-0.5'>
                             <h3 className=''><span className='px-2 text-red-500'>&#x25CF;</span>
                             Live Chat
                             </h3>
                             {copyBtn && <h3 className='bg-green-500 px-2 rounded'>copied</h3>}
                             <a href='/' className='mr-1 hover:text-red-400  px-4 hover:bg-white rounded rounded-xl bg-red-400 text-white'>
                                 Leave Room
                             </a>
                        </div>
                    <div style={{height:'84%'}} className=''>
                        <ScrollToBottom className="h-full overflow-auto">
                            
                        {/* {tempData()} */}
                        {messageList.map((messageContent) => {
                            if(username === messageContent.author ){
                                //you
                                return (
                                    <div className='grid grid-cols-8  '>
                                        <div className='col-start-3 col-span-6  '>
                                            <div className='flex flex-col items-end'>
                                            <div className=' bg-blue-500 dark:bg-neutral-700 m-2 p-2 
                                        text-white
                                        rounded rounded-lg'>
                                                <p>{messageContent.message}</p>
                                                <div className='flex justify-end
                                                text-slate-300 dark:text-gray-400'>
                                                    <p id="time " className=''>{messageContent.time}</p>
                                                    <p id="author" className='px-2'>{messageContent.author}</p>
                                                    <CopyToClipboard text={messageContent.message}>
                                                    <button onClick={() => {setCopyBtn(true)}} className='hover:text-white'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                                                            <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
                                                        </svg>
                                                    </button>
                                                    </CopyToClipboard>
                                                </div>
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                )
                            }else if ( messageContent.author === 'Bot'){
                                return (
                                    <div className='grid grid-cols-8'>
                                        <div className='col-start-2 col-span-6 
                                        flex flex-col items-center'>
                                            <div className=' bg-neutral-700 dark:bg-blue-500 m-2 p-2 
                                        text-white
                                        rounded rounded-lg'>
                                                <p>{messageContent.message}</p>
                                                {/* <div className='flex justify-end
                                                dark:text-slate-300 text-gray-400'>
                                                    <p id="time " className=''>{messageContent.time}</p>
                                                    <p id="author" className='px-2'>{messageContent.author}</p>
                                                </div> */}
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                            //others
                            return (
                                <div className='grid grid-cols-8  '>
                                        <div className=' col-span-6 '>
                                            <div className='flex flex-col items-start'>

                                            <div className='bg-indigo-500 dark:bg-neutral-600 m-2 p-2 
                                        text-white
                                        rounded rounded-lg'>
                                                <p>{messageContent.message}</p>
                                                <div className='flex 
                                                text-slate-300 dark:text-gray-400'>
                                                    <p id="time " className=''>{messageContent.time}</p>
                                                    <p id="author" className='px-2'>{messageContent.author}</p>
                                                    <CopyToClipboard text={messageContent.message}>
                                                    <button onClick={() => {setCopyBtn(true)}} className='hover:text-white'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                                                            <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
                                                        </svg>
                                                    </button>
                                                    </CopyToClipboard>
                                                </div>
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                            )
                            
                        })}
                        </ScrollToBottom>
                    </div>
                    <div className='h-fit flex justify-center items-center'>
                    <input type="text" placeholder=" " 
                        className=' py-1 w-full px-2 mx-4 text-xl text-black dark:text-white
                        bg-white dark:bg-neutral-800 border-black dark:border-white border-opacity-30 hover:border-opacity-100 dark:border-opacity-30 dark:hover:border-opacity-100 border rounded-lg border-opacity-50 
                        outline-none focus:border-blue-500 dark:focus:border-blue-500 placeholder-gray-300 placeholder-opacity-0 transition duration-200'
                        value={currentMessage} 
                        onChange={(e) => setCurrentMessage(e.target.value)} 
                         onKeyPress={(event) => {
                            event.key === "Enter" && sendMessage();
                        }} />
                        <div className='mr-4 text-black dark:text-white hover:text-blue-600 dark:hover:text-blue-600' onClick={sendMessage}>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                            </svg>
                         </div>
                    </div>
                </div>
            </div>

            


            {/* Mobile */}
            <div className='sm:hidden h-full w-full mx-4  
            grid grid-rows-8 sm:grid-cols-8 gap-4'>
                <div style={{height:'25vh'}} className='row-span-2 sm:col-span-3 bg-white
                 rounded rounded-xl dark:bg-neutral-800 text-white dark:text-white'>
                    <div style={{height: '20%'}} className='p-1 bg-blue-500 flex justify-between'>
                        <h3 className='font-semibold'>UserName: {username}</h3>
                        <h3 className='bg-blue-500 font-semibold'>Room ID: {room}</h3>
                    </div>
                        <h3 style={{height: '20%'}} className='p-1 text-center text-black  dark:text-white uppercase font-4xl bg-gray-100 dark:bg-neutral-700'>Active Users</h3>
                        
                    <div style={{height: '60%'}} className="users overflow-auto">
                            <div className='Grid grid-cols-4'>
                                {/* { tempData()} */}
                            </div>
                            {
                            users.map((u) => {
                                return u.map(user => {
                                    console.log("u:")
                                    console.log(user);
                                    return (
                                        <p className='px-4 py-1 text-black dark:text-white font-semibold'><span className='px-2 text-green-500'>&#x25CF;</span>{user?.username}</p>   
                                )
                                })
                                }
                            )}
                    </div>
                </div>
                {/* {right} */}
                <div style={{height:'56vh'}} 
                className='row-span-5 sm:col-span-5 bg-white rounded rounded-xl dark:bg-neutral-800'>
                         <div style={{height:'8%'}}  className='flex justify-between items-center font-semibold text-center text-white bg-blue-500 p-0.5'>
                             <h3 className=''><span className='px-2 text-red-500'>&#x25CF;</span>
                             Live Chat
                             </h3>
                             {copyBtn && <h3 className='bg-green-500 px-2 rounded'>copied</h3>}
                             <a href='/' className=' hover:text-red-400 mr-1  px-4 hover:bg-white rounded rounded-xl bg-red-400 text-white'>
                                 Leave Room
                             </a>
                        </div>
                    
                    <div style={{height:'78%'}} className=''>
                        <ScrollToBottom className="h-full overflow-auto">
                            
                        {/* {tempData()} */}
                        {messageList.map((messageContent) => {
                            if(username === messageContent.author ){
                                //you
                                return (
                                    <div className='grid grid-cols-8  '>
                                        <div className='col-start-3 col-span-6 
                                        '>
                                            <div className='flex flex-col items-end'>

                                            <div className='bg-blue-500 dark:bg-neutral-700 m-2 p-2 
                                        text-white
                                        rounded rounded-lg'>
                                                <p>{messageContent.message}</p>
                                                <div className='flex justify-end
                                                text-slate-300 dark:text-gray-400'>
                                                    <p id="time " className=''>{messageContent.time}</p>
                                                    <p id="author" className='px-2'>{messageContent.author}</p>
                                                    <CopyToClipboard text={messageContent.message}>
                                                    <button onClick={() => {setCopyBtn(true)}} className='hover:text-white'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                                                            <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
                                                        </svg>
                                                    </button>
                                                    </CopyToClipboard>
                                                </div>
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                )
                            }else if ( messageContent.author === 'Bot'){
                                return (
                                    <div className='grid grid-cols-8'>
                                        <div className='col-start-2 col-span-6 
                                        flex flex-col items-center'>
                                            <div className=' bg-neutral-700 dark:bg-blue-500 m-2 p-2 
                                        text-white
                                        rounded rounded-lg'>
                                                <p>{messageContent.message}</p>
                                                {/* <div className='flex justify-end
                                                dark:text-slate-300 text-gray-400'>
                                                    <p id="time " className=''>{messageContent.time}</p>
                                                    <p id="author" className='px-2'>{messageContent.author}</p>
                                                </div> */}
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                            //others
                            return (
                                <div className='grid grid-cols-8  '>
                                        <div className=' col-span-6 '>
                                            <div className='flex flex-col items-start'>
                                                <div className='bg-indigo-500 dark:bg-neutral-600 m-2 p-2 
                                        text-white
                                        rounded rounded-lg'>
                                                    <p>{messageContent.message}</p>
                                                    <div className='flex 
                                                    text-slate-300 dark:text-gray-400'>
                                                    <p id="time " className=''>{messageContent.time}</p>
                                                    <p id="author" className='px-2'>{messageContent.author}</p>
                                                    <CopyToClipboard text={messageContent.message}>
                                                    <button onClick={() => {setCopyBtn(true)}} className='hover:text-white'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                                                            <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
                                                        </svg>
                                                    </button>
                                                    </CopyToClipboard>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                            )
                            
                        })}
                        </ScrollToBottom>
                    </div>
                    <div style={{height:'16%'}} className='pb-2 flex justify-center items-center'>
                    <input type="text" placeholder=" " 
                        className='mt-1 py-1 w-full px-2 mx-4 text-xl text-black dark:text-white
                        bg-white dark:bg-neutral-800 border-black dark:border-white border-opacity-30 hover:border-opacity-100 dark:border-opacity-30 dark:hover:border-opacity-100 border rounded-lg border-opacity-50 
                        outline-none focus:border-blue-500 dark:focus:border-blue-500 placeholder-gray-300 placeholder-opacity-0 transition duration-200'
                        value={currentMessage} 
                        onChange={(e) => setCurrentMessage(e.target.value)} 
                         onKeyPress={(event) => {
                            event.key === "Enter" && sendMessage();
                        }} />
                        <div className='mr-4 text-black dark:text-white hover:text-blue-600 dark:hover:text-blue-600' onClick={sendMessage}>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                            </svg>
                         </div>
                    </div>
                
                </div>
            </div>
        </>
    )
}

export default Chat
