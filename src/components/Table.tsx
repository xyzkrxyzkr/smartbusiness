import React, { useEffect } from 'react'
import { AppDispatch, type RootState } from '../app/store.ts'
import { useSelector, useDispatch } from 'react-redux'
import { fetchUsers, setFilter } from '../features/table/tableSlice.ts'
import './table.css'

export default function Table() {
    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
      dispatch(fetchUsers())
    }, [dispatch])

    const { users, status, error, filters } = useSelector((state: RootState) => state.table)
    
    const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      dispatch(setFilter({ field: name as keyof typeof filters, value }))
    }

    const filteredUsers = users.filter(user =>
      user.name.toLowerCase().includes(filters.name.toLowerCase()) &&
      user.username.toLowerCase().includes(filters.username.toLowerCase()) &&
      user.email.toLowerCase().includes(filters.email.toLowerCase()) &&
      user.phone.toLowerCase().includes(filters.phone.toLowerCase())
    )

    return (
      <div className='table-container'>
        <div className='table-wrapper'>
          {status === 'loading' ? (
            <div className="loading">Loading...</div>
          ) : status === 'failed' ? (
            <div className="error">Error occurred: {error}</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th><input type='text' name='name' value={filters.name} onChange={handleFilter} placeholder="Filter by name" /></th>
                  <th><input type='text' name='username' value={filters.username} onChange={handleFilter} placeholder="Filter by username" /></th>
                  <th><input type='text' name='email' value={filters.email} onChange={handleFilter} placeholder="Filter by email" /></th>
                  <th><input type='text' name='phone' value={filters.phone} onChange={handleFilter} placeholder="Filter by phone" /></th>
                </tr>
                <tr>
                  <th>Full Name</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Phone</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
}