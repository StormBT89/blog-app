import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Modal, ModalBody, ModalHeader, Button } from 'flowbite-react'
import { HiOutlineExclamationCircle } from 'react-icons/hi'


export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/user/getusers`);
        const data = await res.json();
        
        if(res.ok){
          setUsers(data.users);
          if (data.users.length < 9 ) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    }

    if (currentUser.isAdmin) {
      fetchUsers();
    }
    
  }, [currentUser._id]);


  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);      
    }
  }

  const handleDeleteUser = async () => {

  }

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3'>      
      {
        currentUser.isAdmin && users.length > 0 ? (
          <>
            <Table hoverable className='text-center shadow-md'>
              <TableHead>
                <TableHeadCell>
                  Датум на креирање на корисник
                </TableHeadCell>
                <TableHeadCell>
                  Фотографија на корисник
                </TableHeadCell>
                <TableHeadCell>
                  Корисничко име
                </TableHeadCell>
                <TableHeadCell>
                  Е-маил на корисник
                </TableHeadCell>
                <TableHeadCell>
                  Профил на корисник
                </TableHeadCell>                
                <TableHeadCell>
                  Избриши корисник
                </TableHeadCell>
              </TableHead>
              {
                users.map((user) => (
                  <TableBody className='divide-y' key={user._id}>
                    <TableRow className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>                        
                          <img src={user.profilePicture} alt={user.username} className='w-10 h-10 mx-auto rounded-full object-cover bg-gray-500'/>                        
                      </TableCell>
                      <TableCell>                        
                          {user.username}                        
                      </TableCell>
                      <TableCell>                        
                          {user.email}                        
                      </TableCell>
                      <TableCell>                        
                          {user.isAdmin ? 'Раководител': 'Оператор'}                        
                      </TableCell>                
                      <TableCell>
                        <span onClick={() => {
                          setShowModal(true);
                          setUserIdToDelete(user._id);
                        }} className='font-medium text-red-500 hover:underline cursor-pointer'>
                          Избриши
                        </span>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                ))
              }
            </Table>   
            { 
              showMore && users.length > 8 && (
                <button onClick={handleShowMore} className='w-full text-orange-600 self-center text-sm py-3'>
                  Прикажи повеќе
                </button>
              )
            }         
          </>
        ) : (
        <p>Не постои корисник</p>
        )
      }
        <Modal show={showModal} onClose={()=> setShowModal(false)} popup size='md'>
                <ModalHeader />
                <ModalBody>        
                <div className='text-center'>          
                    <HiOutlineExclamationCircle className='h-10 w-10
                     text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
                     <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Дали сте сигурни дека сакате да го избришете избраниот корисник? </h3>
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
