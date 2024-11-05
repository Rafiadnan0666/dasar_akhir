import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Card, CardContent, Typography, Divider } from '@mui/material'
import { useParams } from 'react-router'

const OrderSe = () => {
  const [barangList, setBarangList] = useState([])
  const [users, setUsers] = useState([])
  const { id } = useParams()  // Get user ID from route parameters

  // Fetch all barang (items)
  const fetchBarang = async () => {
    try {
      const response = await axios.get("http://localhost:8000/barangs")
      const filteredBarang = response.data.filter(barang => barang.user_id === parseInt(id))
      setBarangList(filteredBarang)
    } catch (error) {
      console.error("Error fetching barang:", error)
    }
  }

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/users")
      setUsers(response.data)
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  useEffect(() => {
    fetchBarang()
    fetchUsers()
  }, [id])

  const getUserById = (userId) => users.find(user => user.id === userId)

  return (
    <div className="container mx-auto p-4 space-y-6">
      {barangList.length > 0 ? (
        barangList.map((barang) => {
          const user = getUserById(barang.user_id)
          return (
            <Card key={barang.id} className="bg-white shadow-lg rounded-lg mb-4">
              <CardContent>
                <Typography variant="h5" className="font-bold text-gray-800">
                  {barang.name}
                </Typography>
                <Typography variant="body2" className="text-gray-500 mb-4">
                  {barang.description}
                </Typography>
                <Divider className="my-2" />

                {/* User Information */}
                {user ? (
                  <div className="mt-4">
                    <Typography variant="h6" className="font-semibold text-gray-700">
                      Ordered by: {user.name}
                    </Typography>
                    <Typography variant="body2" className="text-gray-600">
                      Email: {user.email}
                    </Typography>
                    <Typography variant="body2" className="text-gray-600">
                      Contact: {user.contact}
                    </Typography>
                  </div>
                ) : (
                  <Typography variant="body2" className="text-gray-500">
                    User information not available.
                  </Typography>
                )}
              </CardContent>
            </Card>
          )
        })
      ) : (
        <Typography variant="h6" className="text-gray-500 text-center">
          No orders found for this user.
        </Typography>
      )}
    </div>
  )
}

export default OrderSe
