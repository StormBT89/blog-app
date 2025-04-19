import { TextInput, Select, FileInput, Button, Textarea, Alert } from 'flowbite-react'
import { useState } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase.js'
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

export default function CreatePost() {

  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});

  const handleUploadImage = async () => {
    try {
      if(!file) {
        setImageUploadError('Ве молиме изберете фотографија за прикачување');
        return;
      } 
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + '-' + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError('Грешка во прикачувањето на фотографијата');
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({...formData, image: downloadUrl});
          });
        }
      );  
    } catch (error) {
      setImageUploadError('Прикачувањето на фотографијата е неуспешно');
      setImageUploadProgress(null);
      console.log(error);
    }

  }

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my=7 font-semibold mb-4">Креирај нов состанок</h1>        
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput type='text' id='title' placeholder='Наслов на состанокот..' required className='flex-1' />
            <Select>
              <option value='kolegijalen'>Колегиум</option>
              <option value='nedelen'>Неделен</option>
              <option value='iten'>Итен</option>
              <option value='mesecen'>Месечен</option>
            </Select>
        </div>
        <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
          <FileInput type='file' accept='image/*' onChange={(e) => setFile(e.target.files[0])}/>
          <Button disabled={imageUploadProgress} type='button' onClick={handleUploadImage} size='sm' className='bg-gradient-to-r from-white-200 via-gray-500 to-black-500'>
            {
              imageUploadProgress ?
              (<div className='w-16 h-16'>
                <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`}/>                                
              </div>) : (
                  'Прикачи фотографија'
              ) 
            }            
          </Button>
        </div>
        {
          imageUploadError && (
           <Alert color='failure'>
            {imageUploadError}
           </Alert>
          )
        }
        {
          formData.image && (
            <img src={formData.image} alt='прикачена фотографија' className='w-full h-72 object-cover'/>
          )
        }
        <Textarea id='content' placeholder='Инфо за состанок..' required rows={5}>
        </Textarea>
        <Button type='submit' className='bg-gradient-to-r from-white-200 via-gray-500 to-black-500'>
          Поднеси
        </Button>
      </form>         
    </div>
  )
}
