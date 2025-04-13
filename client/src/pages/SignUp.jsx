import { Alert, Button, FloatingLabel, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value.trim()});
  };

  const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.username || !formData.email || !formData.password) {
          return setErrorMessage('Задолжително е внесување на вредности во сите полиња за регистрација');
        }

        try {
          setLoading(true);
          setErrorMessage(null);
          const res = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(formData),
          });
          const data = await res.json();    
          if (data.success === false) {
            return setErrorMessage(data.message);
          }
          setLoading(false);
          if(res.ok) {
            navigate('/sign-in')
          }
          
        } catch (error) {
          setErrorMessage(error.message);
          setLoading(false);
        }
  }

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
         StormIt Solutions
        </p>
        </div>   
        {/* right */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <FloatingLabel variant="filled" label="Kорисничко име" disabled={true}/>
              <TextInput type="text"
                         placeholder=""
                         id='username'
                         onChange={handleChange}/>              
            </div>
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
                         placeholder=""
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
                ) : 'Регистрирај се'
              }

                
            </Button>
          </form>
          <div className="gap-2 text-sm mt-5">
            <span> Имате корисничка сметка? </span>
            <Link to={'/sign-in'} className="text-blue-700">
                Најави се
            </Link>
          </div>
          {errorMessage && (
            <Alert className='mt-5' color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>     
    </div>
  )
}
