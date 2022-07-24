import Head from 'next/head'
import Header from './../components/Header';
import { getSession } from "next-auth/react";
import Login from '../components/Login';
import Sidebar from '../components/Sidebar';
import Feed from '../components/Feed';
import Widgets from './../components/Widgets';
import { getDocs, query, collection, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { signIn, signOut, useSession } from 'next-auth/react';


export default function Home({session, posts}) {


  // if(!session) return <button onClick={signIn}>Sign In</button>;
  return (
    <div className='h-screen bg-gray-100 overflow-hidden'>
      <Head>
        <title>Facebook clone</title>
      
      </Head>


       <Header /> 

        <main className='flex'>
          <Sidebar />
          <Feed  posts={posts} />
          <Widgets />
        </main>
    </div>
  )
}


export async function getServerSideProps(context) {
  // Get the user
  const session = await getSession(context);

  const posts = await getDocs(query(collection(db, 'posts'), orderBy('timestamp', 'desc')) );

  const docs = posts.docs.map((post) => ({
    id: post.id,
    ...post.data(),
    timestamp: null,
  }));

  return {
    props: {
       session,
       posts: docs,
    }
  }
}