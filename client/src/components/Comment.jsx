import { useEffect, useState } from "react"
import moment from 'moment'
import { FaThumbsUp } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { Button, Textarea } from 'flowbite-react'

export default function Comment({comment, onLike, onEdit, onDelete}) {
    const [user, setUser] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const {currentUser} = useSelector((state) => state.user);   
    const [editedContent, setEditedContent] = useState(comment.content);
    console.log(comment.content);
    
    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch(`/api/user/${comment.userId}`);
                const data = await res.json();                
                if (res.ok) {
                    setUser(data);
                }
            } catch (error) {
                console.log(error);
            }
              
        }
        getUser();
    }, [comment])

  const handleEdit =  () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  }

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/comment/editComment/${comment._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }, 
        body: JSON.stringify({
          content: editedContent,
        }),
      });
      if (res.ok) {
        setIsEditing(false);
        onEdit(comment, editedContent);
      }
      
    } catch (error) {
      console.log(error.message);
      
    }
  }

  return (
    <div className="flex p-4 text-sm">
      <div className="flex-shrink-0 mr-3">
       <img className="w-10 h-10 rounded-full bg-gray-200" src={user.profilePicture}/>
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-xs truncate">{user ? `@${user.username}` : 'Анонимен корисник'}</span>
          <span className="text-gray-500 text-xs">{moment(comment.createdAt).fromNow()}</span>
        </div>
        {
          isEditing ? (
            <>
              <Textarea value={editedContent}
                        rows='3'
                        className="mb-2"
                        onChange={(e) => setEditedContent(e.target.value)}/>
              <div className="flex justify-end gap-2 text-xs">
                <Button type="button" size="sm" onClick={handleSave} 
                        className="bg-gradient-to-r from-gray-200 to-blue-500">
                  Зачувај
                </Button>
                <Button type="button" size="sm" onClick={() => setIsEditing(false)} 
                        className="bg-gradient-to-r  from-yellow-200 to-orange-500">
                  Откажи
                </Button>
              </div>
            </>            
          ) : (
            <>
            <p className="text-gray-500 pb-2">
                 {comment.content}
            </p>
            <div className="flex items-center pt-2 text-xs gap-2 max-w-fit">
            <button type="button" onClick={() => onLike(comment._id)} className={`text-gray-400 hover:text-blue-500 ${
              currentUser && comment.likes.includes(currentUser._id) && '!text-blue-500'
            }`}>
              <FaThumbsUp className="text-sm"/>
            </button>
            <p className="text-gray-400">
              {
                comment.numberOfLikes > 0 && 
                    comment.numberOfLikes + " " + (comment.numberOfLikes === 1 ? "Согласност" : "Согласности") 
              }
            </p>
            {
              currentUser && (currentUser._id === comment.userId || currentUser.isAdmin) && (
                <>
                <button type="button" onClick={handleEdit} className="text-gray-400 hover:text-blue-500 cursor-pointer">
                  Измени 
                </button>
                 <button type="button" onClick={() => onDelete(comment._id)} className="text-gray-400 hover:text-red-500 cursor-pointer">
                 Избриши 
               </button>
                </>                
              )
            }
          </div>  
            </>
          )
        }                         
      </div>
    </div>
  )
}
