import { Button, FloatingLabel, TextInput } from "flowbite-react";
import { Link } from "react-router-dom";

export default function SignUp() {
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 mx-auto max-w-3xl flex-col md:flex-row md:items-center gap-5">
        {/* left */}    
        <div className="flex-2">
        <Link to={'/'} className='font-bold dark:text-white text-4xl'>
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
            rounded-lg text-white'>Brain</span>
            Storming
        </Link> 
        <p className="text-sm mt-5 font-medium">
        Регистрирајте се во системот за состаноци, дел од дигиталната платформа  
         StormIt
        </p>
        </div>   
        {/* right */}
        <div className="flex-1">
          <form className="flex flex-col gap-4">
            <div>
              <FloatingLabel variant="filled" label="Kорисничко име" disabled={true}/>
              <TextInput type="text"
                         placeholder=""
                         id='username'/>              
            </div>
            <div>
              <FloatingLabel variant="filled" label="Е-маил" disabled={true}/>
              <TextInput type="text"
                         placeholder=""
                         id='email'/>              
            </div>
            <div>
              <FloatingLabel variant="filled" label="Пасворд" disabled={true}/>
              <TextInput type="text"
                         placeholder=""
                         id='password'/>              
            </div>
            <Button type="submit">
                Регистрирај се
            </Button>
          </form>
          <div className="gap-2 text-sm mt-5">
            <span> Имате корисничка сметка? </span>
            <Link to={'/sign-in'} className="text-blue-700">
                Најави се
            </Link>
          </div>
        </div>
      </div>     
    </div>
  )
}
