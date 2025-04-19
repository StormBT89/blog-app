import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react'
import { Link } from 'react-router-dom'

export default function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState({});
  console.log(userPosts);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
        const data = await res.json();
        
        if(res.ok){
          setUserPosts(data.posts);
        }
      } catch (error) {
        console.log(error.message);
      }
    }

    if (currentUser.isAdmin) {
      fetchPosts();
    }
    
  }, [currentUser._id]);


  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3'>      
      {
        currentUser.isAdmin && userPosts.length > 0 ? (
          <>
            <Table hoverable className='shadow-md'>
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
                  <TableBody className='divide-y'>
                    <TableRow className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                      <TableCell>
                        {new Date(post.updatedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Link to={`/post/${post.slug}`}>
                          <img src={post.image} alt={post.title} className='w-20 h-20 object-cover bg-gray-500'/>
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
                        <span className='font-medium text-red-500 hover:underline cursor-pointer'>
                          Избриши
                        </span>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                ))
              }
            </Table>            
          </>
        ) : (
        <p>Нема креиран состанок од Ваша страна</p>
        )
      }
    </div>
  )
}
