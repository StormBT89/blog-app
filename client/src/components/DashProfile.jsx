import { useSelector } from 'react-redux'
import { Alert, Button, Modal, ModalBody, ModalHeader, TextInput } from 'flowbite-react'
import { useEffect, useRef, useState } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateStart, updateSuccess, updateFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure } from '../redux/user/userSlice'
import { useDispatch } from 'react-redux'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

export default function DashProfile() {

  const {currentUser, error} = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);  
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({});

  const filePickerRef = useRef();
  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }    
  }

  useEffect(() => {
    if (imageFile) {      
        uploadImage();        
    }

  }, [imageFile]);

  const uploadImage = () => {
    /*
      service firebase.storage {
      match /b/{bucket}/o {
      match /{allPaths=**} {
      allow read;
      allow write: if
      request.resource.size < 2 * 1024 * 1024 &&
      request.resource.contentType.matches('image/.*')
    }
  }
}
      */
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = 
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setImageFileUploadProgress(progress.toFixed(0));
      }, 
      (error) => {
        setImageFileUploadError(error);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);

      }, 
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({...formData, profilePicture: downloadURL});  
          setImageFileUploading(false);    
        });
      }
      );    
  }

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value});
  }
    
  const handleSubmit = async (e) => {
    e.preventDefault();

    setUpdateUserError(null);
    setUpdateUserSuccess(null);
  
    if (Object.keys(formData).length === 0) {
      setUpdateUserError('Не се направени промени во податоците');
      return;
    }

    if(imageFileUploading) {
      setUpdateUserError('Ве молиме почекајте.. Фотографијата се прикачува.')
      return;
    }

    try {
      dispatch(updateStart());
      
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });      
      const data = await res.json();
      
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess('Корисничката сметка е успешно ажурирана');
      }
      
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
      
    }
  }

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
      
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
      
    }


  }

  return (
      <div className='max-w-lg mx-auto p-3 w-full'>
        <h1 className='my-7 text-center font-semibold text-3xl'>{currentUser.username}</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <input type='file' accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden/>
          <div className=' relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full' 
              onClick={() => filePickerRef.current.click()}>
            {imageFileUploadProgress && (
              <CircularProgressbar value={imageFileUploadProgress || 0} text={`${imageFileUploadProgress}%`}
                                    strokeWidth={5}
                                    styles={{
                                      root: {
                                        width: '100%',
                                        height: '100%',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                      },
                                      path: {
                                        stroke: `rgba(62, 152, 199, ${imageFileUploadProgress / 100})`,
                                      },
                                    }}/>
            )}
            <img src={imageFileUrl || currentUser.profilePicture} alt='корисник' className={`rounded-full w-full h-full 
            object-cover border-8 border-[lightgray] ${imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-60'}`}/>
          </div>   
          {
            imageFileUploadError && <Alert color='failure'>{imageFileUploadError}</Alert>
          }
              <TextInput onChange={handleChange} type='text' id='username' placeholder='Корисничко име' defaultValue={currentUser.username}/>
              <TextInput onChange={handleChange} type='email' id='email' placeholder='Е-маил' defaultValue={currentUser.email}/>
              <TextInput onChange={handleChange} type='password' id='password' placeholder='*******'/>
              <Button type='submit' className='bg-gradient-to-r from-white-200 via-gray-500 to-black-500'>
                Ажурирај кориснички податоци
              </Button>
        </form>
        <div className='text-red-500 flex justify-between mt-5'>
          <span onClick={()=> setShowModal(true)} className='cursor-pointer'>Избриши ја корисничката сметка</span>
          <span className='cursor-pointer'>Одјави се</span>
        </div>
        {
          updateUserSuccess && (
            <Alert color='success' className='mt-5'>
              {updateUserSuccess}
            </Alert>
          )
        }
        {
          updateUserError && (
            <Alert color='failure' className='mt-5'>
              {updateUserError}
            </Alert>
          )
        }
        {
          error && (
            <Alert color='failure' className='mt-5'>
              {error}
            </Alert>
          )
        }
        <Modal show={showModal} onClose={()=> setShowModal(false)} popup size='md'>
          <ModalHeader />
          <ModalBody>
            <div className='text-center'>
              <HiOutlineExclamationCircle className='h-10 w-10
               text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
               <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Дали сте сигурни дека сакате да ја избришете корисничката сметка? </h3>
               <div className='flex justify-center gap-4'>                
                <Button color='red' onClick={handleDeleteUser}>
                  Да, сигурни сме
                </Button>
                <Button color='gray' onClick={() => setShowModal(false)}>
                  Не сме сигурни  
                </Button>

              </div>  
            </div>

          </ModalBody>
          
        </Modal>
      </div>
  )
}
