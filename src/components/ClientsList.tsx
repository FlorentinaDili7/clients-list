import React, { useState, useEffect } from 'react';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;

}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>(''); 
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://dummyjson.com/users?page=${currentPage}`);
        const data = await response.json();
        console.log('API Response:', data);
        setUsers(data.users);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  useEffect(() => {
    // Implement logic for fetching user posts when selectedUserId changes
    const fetchUserPosts = async () => {
      if (selectedUserId !== null) {
        try {
          const response = await fetch(`https://dummyjson.com/posts?userId=${selectedUserId}`);
          const data = await response.json();
          setPosts(data);
        } catch (error) {
          console.error('Error fetching user posts:', error);
        }
      }
    };

    fetchUserPosts();
  }, [selectedUserId]);

  const handleUserClick = (userId: number) => {
    setSelectedUserId(userId);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  const handleSortChange = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(filter.toLowerCase()) ||
      user.lastName.toLowerCase().includes(filter.toLowerCase()) ||
      user.email.toLowerCase().includes(filter.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.firstName.localeCompare(b.firstName);
    } else {
      return b.firstName.localeCompare(a.firstName);
    }
  });

  return (
    <div className='bg-black text-white'>
      <h1>User List</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <div>
            <label>
              Filter:
              <input type='text' value={filter} onChange={handleFilterChange} />
            </label>
            <button onClick={handleSortChange}>
              Sort {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            </button>
          </div>
          <ul>
            {sortedUsers.map((user) => (
              <li key={user.id} onClick={() => handleUserClick(user.id)}>
                {user.firstName} - {user.lastName} ({user.email})
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
