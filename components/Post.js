import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { ChatAltIcon, ShareIcon, ThumbUpIcon} from "@heroicons/react/outline";
import { ThumbUpIcon as ThumbUpIconFilled } from "@heroicons/react/solid";
import { db } from '../firebase';
import { addDoc, collection, serverTimestamp, onSnapshot, query, orderBy, setDoc, deleteDoc, doc } from 'firebase/firestore';
import { UserCircleIcon} from "@heroicons/react/solid";


import { useSession } from 'next-auth/react';
import Moment from 'react-moment';
// import Moment from 'react-moment';



function Post({id,name, message, email, timestamp, image, postImage}) {

    const {data: session} = useSession();
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [likes, setLikes] = useState([]);
    const [hasLiked, setHasLiked] = useState(false);

    useEffect( () => 
    onSnapshot(query(collection(db, 'posts', id, 'comments'), orderBy("timestamp", "desc")), snapshot => setComments(snapshot.docs))

    , [db, id])

    const sendComment = async (e) => {
        e.preventDefault();
    
        const commentToSend = comment;
    
        setComment('');
    
        await addDoc(collection(db, 'posts', id, 'comments'), {
    
             comment: commentToSend,
             username: session.user.name,
             userImage: session.user.image,
             timestamp: serverTimestamp()
        })
      }

    useEffect( () => 
          onSnapshot(collection(db, 'posts', id, 'likes'), snapshot => setLikes(snapshot.docs))
  , [db, id])


  useEffect( () => 

    setHasLiked(likes.findIndex( (like) => (like.id === session?.user?.uid) ) !== -1) 

  , [likes])


    const likePost = async () => {

        if(hasLiked){
    
           await deleteDoc(doc(db, 'posts', id, 'likes', session.user.uid));
        }
        else{
          await setDoc(doc(db, 'posts', id, 'likes', session.user.uid), {
            username: session.user.name
          })
        } 
    
    }

  return (
    <div className="flex flex-col">

        <div className="p-5 bg-white mt-5 rounded-t-2xl shadow-sm">

            <div className="flex items-center space-x-2">

                <img 
                className= 'rounded-full'
                src={image}
                width={40}
                height={40}
                alt=""
                />

                <div>
                    <p className="font-medium">{name}</p>
                    {timestamp? (
                        <p className="text-xs text-gray-400">
                        {new Date(timestamp?.toDate()).toLocaleString()}
                        </p>
                    ): (
                        <p className="text-xs text-gray-400">Loading</p>
                    )}
                </div>

            </div>

             <p className="pt-4">{message}</p>
        </div>

        {postImage && (
            <div className="relative h-56 md:h-96 bg-white">
                <Image src={postImage} objectFit="cover" layout="fill" alt=''/>
            </div>
        )}


         
         {/* Number of likes and comments  */}

        
        
        <div className={`flex ${likes.length > 0 ? 'justify-between' : 'justify-end'} bg-white py-2 px-3 text-gray-500` }>
            { likes.length > 0 && (
                <div className='flex items-center space-x-1 bg-white'>
                    <span className='bg-blue-500 rounded-full p-1'> 
                        <ThumbUpIconFilled className=' h-3 text-white'/>
                    </span>
                    <p className='mb-1'>{likes.length}</p>
                </div>
             )
            }
        
            { comments.length > 0 && (
                    
                        <p className=' mb-1'>{comments.length} {comments.length > 1 ? 'comments' : 'comment'}</p>     
                )
            }

        </div>

        <div className="flex justify-between items-center border-b bg-white
        shadow-md text-gray-400 border-t">


        {session ? (
            <div className="inputIcon rounded-none ">
                
                {  hasLiked ? (
                    <>
                      <ThumbUpIconFilled className="h-4 text-blue-500" onClick={likePost} /> 
                      <p className="text-xs sm:text-base text-blue-500">Like</p>
                    </>

                   ) : ( 
                    <>
                        <ThumbUpIcon className="h-4"  onClick={likePost}  />
                        <p className="text-xs sm:text-base">Like</p>
                    </>

                )}
                
            </div>
        ): (
            <div className="inputIcon rounded-none ">
                <ThumbUpIcon className="h-4"/>
                <p className="text-xs sm:text-base">Like</p>
            </div>

        )}

            <div className="inputIcon rounded-none">
                <ChatAltIcon className="h-4" />
                <p className="text-xs sm:text-base">Comment</p>
            </div>

            <div className="inputIcon rounded-none ">
                <ShareIcon className="h-4" />
                <p className="text-xs sm:text-base">Share</p>
            </div>

        </div>

        
            <div className='py-4 items-center  bg-white rounded-b-2xl shadow-md'>

                <div className='flex space-x-2 items-center mx-5'>
                    {session ? (
                    <img 
                    src={session.user.image}
                    className='h-7 rounded-full'
                    />
                    ) : (
                       <UserCircleIcon  className='h-7 rounded-full text-gray-500'/>
                     )
                    }

                    {session ? (
                        <form className='flex flex-1'>
                            <input
                            type = "text"
                            value={comment}
                            onChange= {e => setComment(e.target.value)}
                            placeholder="write a comment..."
                            className = "border-none flex-grow focus:ring-0 outline-none rounded-full h-10 px-4 bg-gray-100 text-gray-500" 
                            />
                        
                            <button hidden type="submit" onClick = {sendComment}>
                                Submit
                            </button>
                        </form>
                    ):
                    (
                        <input
                        type = "text"
                        placeholder="write a comment..."
                        className = "border-none flex-grow focus:ring-0 outline-none rounded-full h-10 px-4 bg-gray-100 text-gray-500" 
                        />
                    )}
                </div>


                { comments.length > 0 && 

                <div className="bg-white  rounded-b-2xl  mt-4">
                    <div className='ml-10 max-h-28 overflow-y-scroll scrollbar-thumb-gray-400 scrollbar-thin'>
                    {comments.map(comment => (
                        <div key={comment.id} className='flex items-center mb-3'>
                            <img className='h-7 rounded-full mr-2' src={comment.data().userImage} alt="" />
                            <p className='text-sm rounded-full bg-gray-100 px-5 pt-1 pb-2 max-w-xs lg:max-w-sm mr-auto'>
                                <span className='font-medium'>{comment.data().username}</span>
                                <p className='text-gray-700 break-words'> {" "}{comment.data().comment}</p>
                            </p>
                            
                                <Moment fromNow className='pr-5 text-xs  text-gray-500 ml-2 min-w-fit'>
                                    {comment.data().timestamp?.toDate()}
                                </Moment>
                        
                    
                        </div>
                    ))}
                    </div>
                </div>

                }


            </div>
        

       

        {/* {session && (
          <form className = "flex items-center p-4">

            <EmojiHappyIcon className = "h-7" />

            <input
            type = "text"
            value={comment}
            onChange= {e => setComment(e.target.value)}
            placeholder = "Add a comment ..."
            className = "border-none flex-1 focus:ring-0 outline-none" 
            />

            <button 
            type='submit' 
            disabled={!comment.trim()} 
            onClick = {sendComment}
            className = "font-semibold text-blue-400"> Post </ button >

          </form>

      )} */}


    </div>
  );
}

export default Post