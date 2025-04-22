import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Modal, ModalBody, ModalHeader, Button } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

export default function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState({});
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
        const data = await res.json();
        
        if(res.ok){
          setUserPosts(data.posts);
          if (data.length < 9 ) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    }

    if (currentUser.isAdmin) {
      fetchPosts();
    }
    
  }, [currentUser._id]);


  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await fetch(`/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);      
    }
  }

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/post/deletepost/${postIdToDelete}/${currentUser._id}`,
        {
          method: 'DELETE',
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserPosts((prev) => prev.filter((post) => post._id !== postIdToDelete)
        );
      }
      
    } catch (error) {
        console.log(error.message);
    }
  }


  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3'>      
      {
        currentUser.isAdmin && userPosts.length > 0 ? (
          <>
            <Table hoverable className='text-center shadow-md'>
              <TableHead>
                <TableHeadCell>
                  Датум на последни измени
                </TableHeadCell>
                <TableHeadCell>
                  Фотографија на состанок
                </TableHeadCell>
                <TableHeadCell>
                  Наслов на состанок
                </TableHeadCell>
                <TableHeadCell>
                  Категорија на состанок
                </TableHeadCell>
                <TableHeadCell>
                  Направи измени во состанок
                </TableHeadCell>
                <TableHeadCell>
                  <span>Избриши состанок</span>
                </TableHeadCell>
              </TableHead>
              {
                userPosts.map((post) => (
                  <TableBody className='divide-y' key={post._id}>
                    <TableRow className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                      <TableCell>
                        {new Date(post.updatedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Link to={`/post/${post.slug}`}>
                          <img src={post.image} alt={post.title} className='w-20 h-20 object-cover bg-gray-500 mx-auto'/>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link to={`/post/${post.slug}`} className='font-medium text-gray-900 dark:text-white'>
                          {post.title}
                        </Link>
                      </TableCell>
                      <TableCell>
                        {post.category === 'kolegijalen' ? 'Колегијален' :
                          post.category === 'iten' ? 'Итен' :
                          post.category === 'nedelen' ? 'Неделен' :
                          post.category === 'mesecen' ? 'Месечен' : ' '
                        }
                      </TableCell>                     
                      <TableCell>
                        <Link to={`/update-post/${post._id}`} className='text-purple-800 hover:underline'>
                        <span>Измени</span>
                        </Link>                       
                      </TableCell>
                      <TableCell>
                        <span onClick={() => {
                          setShowModal(true);
                          setPostIdToDelete(post._id);

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
              showMore && userPosts.length > 8 && (
                <button onClick={handleShowMore} className='w-full text-orange-600 self-center text-sm py-3'>
                  Прикажи повеќе
                </button>
              )
            }         
          </>
        ) : (
        <p>Нема креиран состанок од Ваша страна</p>
        )
      }
        <Modal show={showModal} onClose={()=> setShowModal(false)} popup size='md'>
                <ModalHeader />
                <ModalBody>        
                <div className='text-center'>          
                    <HiOutlineExclamationCircle className='h-10 w-10
                     text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
                     <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Дали сте сигурни дека сакате да го избришете овој состанок? </h3>
                     <div className='flex justify-center gap-4'>                
                      <Button color='red' onClick={handleDeletePost}>
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
