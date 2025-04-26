import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Textarea, Alert, Modal, ModalHeader, ModalBody } from 'flowbite-react'
import { useEffect, useState } from 'react';
import Comment from './Comment';
import { HiOutlineExclamationCircle } from 'react-icons/hi'

    export default function CommentSection({postId}) {
    const {currentUser} = useSelector((state) => state.user);
    const [comment, setComment] = useState('');
    const [commentError, setCommentError] = useState(null);
    const [comments, setComments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);
    
    const navigate = useNavigate();

    const [modalEditError, setModalEditError] = useState(false);

    
        
    //console.log(comment); 
    //console.log(postId);

    const handleSubmt = async (e) => {
    e.preventDefault();

    if (comment.length > 500) {
        return;
      }

    try {                
        const res = await fetch('/api/comment/create', {
            method: 'POST',
            headers: {
                    'Content-Type': 'application/json',
                    },
            body: JSON.stringify({
                    content: comment,
                    postId,
                    userId: currentUser._id,
                    }),
                });
                    
        const data = await res.json();
            if (res.ok) {
                setComment('');
                setCommentError(null);       
                setComments([data, ...comments]);         
                }
                
        } catch (error) {
            setCommentError(error.message);                                
        }
    }

    useEffect(() => {
        const getComments = async () => {
            try {
                const res = await fetch(`/api/comment/getPostComments/${postId}`);
                if (res.ok)
                {
                    const data = await res.json();
                    setComments(data);
                }
                
            } catch (error) {
                console.log(error.message);
                
            }
        };
        getComments();

    }, [postId])

    const handleLike = async (commentId) => {
        try {
            if (!currentUser) {
                navigate('/sign-in');
                return;
            }
            const res = await fetch(`/api/comment/likeComment/${commentId}`, {
                method: 'PUT',
            });
            if (res.ok) {
                const data = await res.json();
                setComments(comments.map((comment) => 
                    comment._id === commentId ? 
                {
                    ...comment,
                    likes: data.likes,
                    numberOfLikes: data.likes.length,
                } : comment                
                ));
            }
        } catch (error) {
            console.log(error.message);
            
        }        
    }


    const handleEdit = async(comment, editedContent ) => {
        if (currentUser._id === comment.userId) {
            setComments(
                comments.map((c) => 
                (c._id === comment._id ) ? {...c, content: editedContent} : c )
            )
        } else {
            setModalEditError(true);
            console.log('Немате пристап за промена на мислење');
        }
        
        
    }

    const handleDelete = async (commentId) => {
        setShowModal(false);
        try {
            if(!currentUser) {
                navigate('/sign-in');
                return;
            }

            const res = await fetch(`/api/comment/deleteComment/${commentId}`, {
                method: 'DELETE',
            });            
            if (res.ok) {
                const data = await res.json();
                setComments(comments.filter((comment) => comment._id !== commentId));

             }             
            
        } catch (error) {
            console.log(error.message);
            
        }

    }


  return (
    <div className='max-w-2xl mx-auto w-full p-3'>
      {
        currentUser ? (
            <div className='flex items-center gap-1 my-5 text-gray-500 text-sm'>
                <p>Најавени сте со корисничко име: </p>  
                <img className='h-5 w-5 object-cover rounded-full' src={currentUser.profilePicture}/>
                <Link to={'/dashboard?tab=profile'} className='text-xs text-cyan-600 hover:underline'>
                    @{currentUser.username}
                </Link>              
            </div>
        ) : (
            <div className='text-sm text-orange-500 my-5 flex gap-6'>
                Потребно е да се најавите во системот за да може да се вклучите во дискусијата.
                <Link className='text-blue-500 hover:underline' to={'/sign-in'}>
                    Најавете се
                </Link>
            </div>
        )
      }
      {
        currentUser && (
            <form onSubmit={handleSubmt} className='border border-gray-500 rounded-md p-3'>
                <Textarea   placeholder='Внесете Ваше мислење во дискусијата.. '
                            rows='3'
                            maxLength='500'
                            onChange={(e) => setComment(e.target.value)}
                            value={comment}/>       
                <div className='flex justify-between items-center mt-5'>
                    <p className='text-gray-500 text-xs'>
                    Ви преостануваат уште {parseInt(500 - comment.length)} карактери 
                    </p>
                    <Button type='submit' className=''>
                        Поднеси мислење
                    </Button>
                </div>   
                {
                commentError &&   
                <Alert color='red' className='mt-5'>
                    {commentError}
                </Alert>     
                }
              
            </form>
        )
      }
      {
        comments.length === 0 ? (
            <p className='text-sm my-5'>
                Не е започната дискусија за состанокот
            </p>
        ) : (
            <>
             <div className='text-sm my-5 flex items-center gap-1'>
                <p>
                    Доставени мислења
                </p>
                <div className='border border-gray-400 py-1 px-2 rounded-sm '>
                    <p>
                        {comments.length}
                    </p>
                </div>
            </div>
            {
               comments.map((comment) => (
                    <Comment key={comment._id}
                             comment={comment}
                             onLike={handleLike}
                             onEdit={handleEdit}
                             onDelete={(commentId) => {
                                setShowModal(true);
                                setCommentToDelete(commentId);
                             }}/>
                ))
            }
            </>
           
        )
      }       
      <Modal show={showModal}
             onClose={() => setShowModal(false)}
             popup
             size='md'>
        <ModalHeader/>
        <ModalBody>
            <div className='text-center'>
                <HiOutlineExclamationCircle className='h-10 w-10
                     text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
                 <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Дали сте сигурни дека сакате да го избришете Вашето мислење?</h3>
                 <div className='flex justify-center gap-4'>
                    <Button color='red' onClick={() => handleDelete(commentToDelete)}>
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
