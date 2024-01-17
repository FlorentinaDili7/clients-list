import React, { useState, useEffect } from 'react';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  // Add other properties as per your API response
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://dummyjson.com/users?page=${currentPage}`);
        const data = await response.json();
        console.log('API Response:', data);
        setUsers(data.users); // Assuming 'users' is the array of users in the API response
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  const handleUserClick = async (userId: number) => {
    try {
      const response = await fetch(`https://dummyjson.com/posts?userId=${userId}`);
      const data = await response.json();
      setPosts(data);
      setSelectedUserId(userId);
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  };

  return (
    <div className='bg-black text-white'>
      <h1>User List</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <ul>
            {Array.isArray(users) &&
              users.map((user) => (
                <li key={user.id} onClick={() => handleUserClick(user.id)}>
                  {user.firstName} - {user.lastName}
                </li>
              ))}
          </ul>
          {selectedUserId && (
            <div>
              <h2>Posts by {users.find((user) => user.id === selectedUserId)?.firstName}</h2>
              <ul>
                {Array.isArray(posts) &&
                  posts.map((post) => (
                    <li key={post.id}>{post.title}</li>
                  ))}
              </ul>
            </div>
          )}
          <div>{/* Add pagination component here */}</div>
        </div>
      )}
    </div>
  );
};

export default UserList;
