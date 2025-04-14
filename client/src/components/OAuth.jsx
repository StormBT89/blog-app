import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from 'react-icons/ai'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { app } from '../firebase'
import { useDispatch } from 'react-redux'
import { signInSuccess } from '../redux/user/userSlice'
import { useNavigate } from 'react-router-dom'

export default function OAuth() {
  
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account'});
    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);      
      const res = await fetch('/api/auth/google',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({
          name: resultsFromGoogle.user.displayName,
          email: resultsFromGoogle.user.email,
          googlePhotoUrl: resultsFromGoogle.user.photoURL,
        }),
      });
      const data = await res.json();   
      
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate('/');
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
   <Button onClick={handleGoogleClick} type="button" className='bg-gradient-to-br from-pink-600 to-orange-500
   text-white hover:bg-gradient-to-bl focus:ring-pink-200 dark:focus:ring-pink-800'>
        Пристапи со -- <AiFillGoogleCircle/> -- Google       
   </Button>
  )
}
