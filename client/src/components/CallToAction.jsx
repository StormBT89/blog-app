import { Button } from 'flowbite-react'
import { Link } from 'react-router-dom'

export default function CallToAction() {
  return (
    <div className='flex flex-col sm:flex-row p-3 border-teal-500 justify-center items-center text-center'>
      <div className='flex-1 justify-center flex flex-col'>
        <h2 className='text-2xl'>
            Повеќе информации за проектот
        </h2>
        <p className='text-gray-500 my-2'>
            Проверете ги сите достапни информации и податоци во врска со проектот
        </p>
        <Link to={'/projects'}>
        <Button className='bg-gradient-to-r from-yellow-200 to-red-500 mx-auto cursor-pointer'>
            Инфо    
        </Button>
        </Link>      
      </div>
      <div className="p-7 flex-1">
        <img src="https://images.unsplash.com/photo-1744970018496-c003c2e66163?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyMnx8fGVufDB8fHx8fA%3D%3D"/>
      </div>
    </div>
  )
}
