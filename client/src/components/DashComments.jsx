import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Modal, ModalBody, ModalHeader, Button } from 'flowbite-react'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

export default function DashComments() {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comment/getcomments`);
        const data = await res.json();
        
        if(res.ok){
          setComments(data.comments);
          if (data.comments.length < 9 ) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    }

    if (currentUser.isAdmin) {
      fetchComments();
    }
    
  }, [currentUser._id]);


  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const res = await fetch(`/api/comment/getcomments?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => [...prev, ...data.comments]);
        if (data.comments.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);      
    }
  }

  const handleDeleteComment = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/comment/deleteComment/${commentIdToDelete}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => prev.filter((comment) => comment._id !== commentIdToDelete));
        setShowModal(false);
      } else {
        console.log(data.message);
      }

    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3'>      
      {
        currentUser.isAdmin && comments.length > 0 ? (
          <>
            <Table hoverable className='text-center shadow-md'>
              <TableHead>
                <TableHeadCell>
                  Датум на последна измена
                </TableHeadCell>
                <TableHeadCell>
                  Содржина на мислење
                </TableHeadCell>
                <TableHeadCell>
                  Број на согласности
                </TableHeadCell>
                <TableHeadCell>
                  Број на состанок
                </TableHeadCell>
                <TableHeadCell>
                  Подносител на мислење
                </TableHeadCell>                
                <TableHeadCell>
                  Избриши мислење
                </TableHeadCell>
              </TableHead>
              {
                comments.map((comment) => (
                  <TableBody className='divide-y' key={comment._id}>
                    <TableRow className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                      <TableCell>
                        {new Date(comment.updatedAt).toLocaleDateString()}
                      </TableCell>                     
                      <TableCell>                        
                          {comment.content}                        
                      </TableCell>
                      <TableCell>                        
                          {comment.numberOfLikes}                        
                      </TableCell>
                      <TableCell>                        
                          {comment.postId}                        
                      </TableCell>   
                      <TableCell>                        
                          {comment.userId}                        
                      </TableCell>                                      
                      <TableCell>
                        <span onClick={() => {
                          setShowModal(true);
                          setCommentIdToDelete(comment._id);
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
              showMore && comments.length > 8 && (
                <button onClick={handleShowMore} className='w-full text-orange-600 self-center text-sm py-3'>
                  Прикажи повеќе
                </button>
              )
            }         
          </>
        ) : (
        <p>Доскусијата сеуште не е започната</p>
        )
      }
        <Modal show={showModal} onClose={()=> setShowModal(false)} popup size='md'>
                <ModalHeader />
                <ModalBody>        
                <div className='text-center'>          
                    <HiOutlineExclamationCircle className='h-10 w-10
                     text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
                     <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Дали сте сигурни дека сакате да го избришете избраното мислење? </h3>
                     <div className='flex justify-center gap-4'>                
                      <Button color='red' onClick={handleDeleteComment}>
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
