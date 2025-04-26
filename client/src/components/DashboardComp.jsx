import { useEffect, useState } from 'react';
import { useSelector} from 'react-redux'
import { HiAnnotation, HiArrowNarrowUp, HiDocumentText, HiOutlineUserGroup} from 'react-icons/hi'
import { Button, Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell } from 'flowbite-react'
import { Link } from 'react-router-dom'

export default function DashboardComp() {
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);

  const {currentUser} = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/user/getusers?limit=5');
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthUsers(data.lastMonthUsers);
        }         
      } catch (error) {
        console.log(error.message);        
      }     
    }

    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/post/getposts?limit=5');
        const data = await res.json();  
        if (res.ok) {
          setPosts(data.posts);
          setTotalPosts(data.totalPosts);
          setLastMonthPosts(data.lastMonthPosts);
        }        
      } catch (error) {
        console.log(error.message);
      }     
    }

    const fetchComments = async () => {
      try {
        const res = await fetch('/api/comment/getcomments?limit=5');
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          setTotalComments(data.totalComments);
          setLastMonthComments(data.lastMonthComments);
        }        
      } catch (error) {
        console.log(error.message);
      }
    }

    if(currentUser.isAdmin) {
      fetchUsers();
      fetchPosts();
      fetchComments();
    }

  }, [currentUser])

  return (
    <div className='p-3 md:mx-auto'>    
      <div className='flex flex-wrap gap-4 justify-center'> 
        <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
          <div className='flex justify-between'>
            <div className=''>
              <h3 className='text-gray-500 text-md uppercase'>Вкупно корисници</h3>
              <p className='text-2xl'>{totalUsers}</p>             
            </div>
            <HiOutlineUserGroup className='bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg'/>
            </div>
            <div className='flex gap-2 text-sm'>
              <span className='text-green-500 flex items-center'>
                <HiArrowNarrowUp/>
                {lastMonthUsers}
              </span>
              <div className='text-gray-500'>Последен месец</div>
            </div>
          </div>    
        <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
          <div className='flex justify-between'>
            <div className=''>
              <h3 className='text-gray-500 text-md uppercase'>Вкупно состаноци</h3>
              <p className='text-2xl'>{totalPosts}</p>             
            </div>
            <HiDocumentText className='bg-indigo-600 text-white rounded-full text-5xl p-3 shadow-lg'/>
            </div>
            <div className='flex gap-2 text-sm'>
              <span className='text-green-500 flex items-center'>
                <HiArrowNarrowUp/>
                {lastMonthPosts}
              </span>
              <div className='text-gray-500'>Последен месец</div>
            </div>
          </div>          
        <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
          <div className='flex justify-between'>
            <div className=''>
              <h3 className='text-gray-500 text-md uppercase'>Вкупно мислења</h3>
              <p className='text-2xl'>{totalComments}</p>             
            </div>
            <HiAnnotation className='bg-lime-600 text-white rounded-full text-5xl p-3 shadow-lg'/>
            </div>
            <div className='flex gap-2 text-sm'>
              <span className='text-green-500 flex items-center'>
                <HiArrowNarrowUp/>
                {lastMonthComments}
              </span>
              <div className='text-gray-500'>Последен месец</div>
            </div>
          </div>     
        </div>     
        <div className='flex flex-wrap gap-4 py-3 mx-auto justify-center'>
          <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
            <div className='flex justify-between p-3 text-sm font-semibold'>
              <h1 className='text-center p-2'>Последни корисници</h1>
              <Button className='bg-gradient-to-r from-yellow-300 to-blue-500'>
                <Link to={'/dashboard?tab=users'}>
                    Прикажи ги сите
                </Link>                
              </Button>
            </div>
            <Table hoverable>
              <TableHead>
                <TableHeadCell>
                  Корисничка слика
                </TableHeadCell>
                <TableHeadCell>
                  Корисничко име
                </TableHeadCell>                
              </TableHead>
              {
                users && users.map((user) => (
                  <TableBody key={user._id} className='divide-y'>
                    <TableRow className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                      <TableCell>
                        <img src={user.profilePicture}
                             alt='user picture'
                             className='w-10 h-10 rounded-full bg-gray-500'/>
                      </TableCell>
                      <TableCell>
                        {user.username}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                ))
              }
            </Table>
          </div>
          <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
            <div className='flex justify-between p-3 text-sm font-semibold'>
              <h1 className='text-center p-2'>Последни состаноци</h1>
              <Button className='bg-gradient-to-r from-yellow-300 to-blue-500'>
                <Link to={'/dashboard?tab=posts'}>
                    Прикажи ги сите
                </Link>                
              </Button>
            </div>
            <Table hoverable>
              <TableHead>
                <TableHeadCell>
                  Слика од состанок
                </TableHeadCell>
                <TableHeadCell>
                  Наслов на состанок
                </TableHeadCell>       
                <TableHeadCell>
                  Категорија на состанок
                </TableHeadCell>             
              </TableHead>
              {
                posts && posts.map((post) => (
                  <TableBody key={post._id} className='divide-y'>
                    <TableRow className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                      <TableCell>
                        <img src={post.image}
                             alt='post picture'
                             className='w-14 h-10 rounded-md bg-gray-500'/>
                      </TableCell>
                      <TableCell>
                        {post.title}
                      </TableCell>
                      <TableCell>
                      {post.category === 'kolegijalen' ? 'Колегијален' :
                          post.category === 'iten' ? 'Итен' :
                          post.category === 'nedelen' ? 'Неделен' :
                          post.category === 'mesecen' ? 'Месечен' : ' '
                        }
                      </TableCell>
                    </TableRow>
                  </TableBody>
                ))
              }
            </Table>
          </div>
          <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
            <div className='flex justify-between p-3 text-sm font-semibold'>
              <h1 className='text-center p-2'>Последни мислења</h1>
              <Button className='bg-gradient-to-r from-yellow-300 to-blue-500'>
                <Link to={'/dashboard?tab=comments'}>
                    Прикажи ги сите
                </Link>                
              </Button>
            </div>
            <Table hoverable>
              <TableHead>
                <TableHeadCell>
                  Содржина на мислење
                </TableHeadCell>
                <TableHeadCell>
                  Согласности
                </TableHeadCell>                
              </TableHead>
              {
                comments && comments.map((comment) => (
                  <TableBody key={comment._id} className='divide-y'>
                    <TableRow className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                      <TableCell className='w-96'>
                        <p className='truncate'>{comment.content}</p>
                      </TableCell>
                      <TableCell>
                        {comment.numberOfLikes}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                ))
              }
            </Table>
          </div>
        </div>
    </div>
  )
}
