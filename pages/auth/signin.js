import { getProviders, signIn as SignIntoProvider} from "next-auth/react"
import React from 'react'
// import Header from './../../components/Header';


function signIn({ providers }) {
  return (
    <>
    {/* <Header /> */}

    <div className = "flex flex-col items-center justify-center min-h-screen py-2 -mt-40 px-14 text-center">

      <img className = "w-72" src = "https://links.papareact.com/t4i" alt = "" />

      <p className = "font-xs italic">
      This is not a REAL app , it is built
      for educational purposes only
      </p>

      <div className="mt-16">
        {Object.values(providers).map((provider) => (
          <div key={provider.name}>
            <button 
            className="p-3 bg-blue-500 rounded-lg text-white"
            onClick={() => SignIntoProvider(provider.id, { callbackUrl: "/" })}>
              Sign in with {provider.name}
            </button>
          </div>
        ))}
      </div>

    </div>

  </>
  )
}

export async function getServerSideProps(context) {
    const providers = await getProviders()
    return {
      props: { providers },
    }
  }


export default signIn