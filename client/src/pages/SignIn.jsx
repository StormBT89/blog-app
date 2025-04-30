import { Alert, Button, FloatingLabel, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice'
import OAuth from "../components/OAuth";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const {loading, error: errorMessage} = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value.trim()});
  };

  const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
          return dispatch(signInFailure('Задолжително е внесување на вредности во сите полиња за најавување'));
        }

        try {
          dispatch(signInStart());
          const res = await fetch('/api/auth/signin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(formData),
          });
          const data = await res.json();    
          if (data.success === false) {
            dispatch(signInFailure(data.message));
          }
          
          if(res.ok) {
            dispatch(signInSuccess(data));
            navigate('/')
          }
          
        } catch (error) {
          dispatch(signInFailure(error.message));
        }
  }

  return (
    <div className="min-h-screen mt-10">
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
         StormIt Solutions
        </p>
        </div>   
        {/* right */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>           
            <div>
              <FloatingLabel variant="filled" label="Е-маил" disabled={true}/>
              <TextInput type="email"
                         placeholder=""
                         id='email'
                         onChange={handleChange}/>              
            </div>
            <div>
              <FloatingLabel variant="filled" label="Пасворд" disabled={true}/>
              <TextInput type="password"
                         placeholder="******"
                         id='password'
                         onChange={handleChange}/>              
            </div>
            <Button type="submit" disabled={loading}>
              {
                loading ? (
                  <>
                   <Spinner size="sm"/>
                   <span>Се вчитуваат податоци.. </span>
                  </>                 
                ) : 'Најави се'
              }

                
            </Button>
            <OAuth/>           
          </form>
          <div className="gap-2 text-sm mt-5">
            <span> Немате корисничка сметка? </span>
            <Link to={'/sign-up'} className="text-blue-700">
                Регистрирај се
            </Link>
          </div>
          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>     
    </div>
  )
}
