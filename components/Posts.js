import React, { useEffect, useState } from 'react'
import { db } from '../firebase';
import { onSnapshot, collection, query, orderBy } from 'firebase/firestore';
import Post from './Post';


function Posts({posts}) {

  const [realTimePosts, setRealTimePosts] = useState([]);

  useEffect( () => 
    onSnapshot(query(collection(db, 'posts'), orderBy('timestamp', 'desc')), snapshot => {
      setRealTimePosts(snapshot.docs);
 })

, [db])

  return (
    <div>
       {
       realTimePosts.length?
       realTimePosts.map( (post) => (        
          <Post
          key={post.id}  
          id={post.id}
          name = {post.data().name}
          message = {post.data().message}
          email = {post.data().email}
          timestamp = {post.data().timestamp}
          image = {post.data().image}
          postImage = {post.data().postImage}
          /> 
        
        )): 
          posts.map( (post) => (    
            <Post
            key={post.id}  
            id={post.id}
            name = {post.name}
            message = {post.message}
            email = {post.email}
            timestamp = {post.timestamp}
            image = {post.image}
            postImage = {post.postImage}
            /> 
        ))}      
    </div>
  )
}

export default Posts