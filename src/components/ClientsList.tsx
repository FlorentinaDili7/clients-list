import React, { useState, useEffect } from "react";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  const usersPerPage = 10;
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://dummyjson.com/users?page=${currentPage}`
        );
        const data = await response.json();
        console.log("API Response:", data);
        setUsers(data.users);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
        setError("Error fetching data. Please try again.");
      }
    };

    fetchData();
  }, [currentPage]);

  useEffect(() => {
    // Filter users based on search term
    const filtered = users.filter(
      (user) =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort the filtered users
    const sortedUsers = [...filtered].sort((a, b) => {
      const compareResult =
        sortOrder === "asc"
          ? a.firstName.localeCompare(b.firstName)
          : b.firstName.localeCompare(a.firstName);

      if (compareResult === 0) {
        return sortOrder === "asc"
          ? a.lastName.localeCompare(b.lastName)
          : b.lastName.localeCompare(a.lastName);
      }

      return compareResult;
    });

    setFilteredUsers(sortedUsers.slice(startIndex, endIndex));
  }, [searchTerm, sortOrder, users, startIndex, endIndex]);

  const handleUserClick = (userId: number) => {
    setSelectedUserId(userId);
  };

  const handleSortChange = () => {
    setSortOrder((prevSortOrder) => (prevSortOrder === "asc" ? "desc" : "asc"));
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(users.length / usersPerPage);
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (selectedUserId !== null) {
        try {
          const response = await fetch(
            `https://dummyjson.com/posts?userId=${selectedUserId}`
          );
          const data = await response.json();

          // Update this line to access data.posts instead of data directly
          setPosts(data.posts);
        } catch (error) {
          console.error("Error fetching user posts:", error);
          setError("Error fetching user posts. Please try again.");
        }
      }
    };

    fetchUserPosts();
  }, [selectedUserId]);

  return (
    <div className="text-gray-900 p-8 vh-screen">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">User List</h1>
      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div>
          <div className="mb-4 flex items-center">
            <label className="text-sm font-medium text-gray-700 mr-2">
              Filter:
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border p-2 rounded-md mr-4"
              placeholder="Search by name or email"
            />
            <button
              className="bg-gray-700 text-white px-4 py-2 rounded-full focus:outline-none"
              onClick={handleSortChange}
            >
              Sort {sortOrder === "asc" ? "Ascending" : "Descending"}
            </button>
          </div>
          <table className="min-w-full bg-white rounded shadow-md">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-gray-700">First Name</th>
                <th className="py-2 px-4 border-b text-gray-700">Last Name</th>
                <th className="py-2 px-4 border-b text-gray-700">Email</th>
                <th className="py-2 px-4 border-b text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-200">
                  <td className="py-2 px-4 border-b border-r">{user.firstName}</td>
                  <td className="py-2 px-4 border-b border-r">{user.lastName}</td>
                  <td className="py-2 px-4 border-b border-r">{user.email}</td>
                  <td className="py-2 px-4 border-b border-r">
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded-full mr-2 focus:outline-none"
                      onClick={() => handleUserClick(user.id)}
                    >
                      Fetch Posts
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 flex flex-row items-center space-between">
            <button
              className={`bg-gray-700 text-white px-4 py-2 rounded-full focus:outline-none ${
                currentPage === 1 ? "cursor-not-allowed" : ""
              }`}
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              {"<<"}
            </button>
            <span className="text-xl font-semibold bg-gray-700 text-white px-4 py-2 rounded-full mx-2">
              {currentPage}
            </span>
            <button
              className={`bg-gray-700 text-white px-4 py-2 rounded-full focus:outline-none ${
                currentPage === Math.ceil(users.length / usersPerPage)
                  ? "cursor-not-allowed"
                  : ""
              }`}
              onClick={handleNextPage}
              disabled={currentPage === Math.ceil(users.length / usersPerPage)}
            >
              {">>"}
            </button>
          </div>

          {selectedUserId && (
          <div className="mt-4">
            <h2 className="text-2xl font-semibold mb-2 text-gray-800">
              Posts by{" "}
              {users.find((user) => user.id === selectedUserId)?.firstName}
            </h2>
            <div>
              {Array.isArray(posts) &&
                posts.map((post) => (
                  <div key={post.id} className="bg-gray-100 p-4 mb-2 rounded-md">
                    <h3 className="text-lg font-semibold mb-1">{post.title}</h3>
                    <p className="text-gray-700">{post.body}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center">
                        <span className="text-gray-600 mr-2">Tags:</span>
                        {post.tags.map((tag:any , index: any) => (
                          <span
                            key={index}
                            className="bg-gray-300 text-gray-700 px-2 py-1 rounded-full text-xs mr-2"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-600 mr-2">Reactions:</span>
                        <span className="bg-yellow-400 text-gray-800 px-2 py-1 rounded-full text-xs mr-2">
                          {post.reactions}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
        </div>
      )}
    </div>
  );
};

export default UserList;
