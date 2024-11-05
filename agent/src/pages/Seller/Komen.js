import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Card, CardContent, Typography, Divider } from '@mui/material'
import LayoutAdmin from '../Admin/LayoutAdmin'

const Komen = () => {
  const [komens, setKomens] = useState([])
  const [barangList, setBarangList] = useState([])
  const { id } = useParams()


  const fetchKomen = async () => {
    try {
      const response = await axios.get("http://localhost:8000/komentars")
      setKomens(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  const fetchBarang = async () => {
    try {
      const response = await axios.get("http://localhost:8000/barangs")
      const filteredBarang = response.data.filter(barang => barang.user_id === id)
      setBarangList(filteredBarang)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchKomen()
    fetchBarang()
  }, [id])

  return (
    <div className="container mx-auto p-4 space-y-6">
      <LayoutAdmin>
      {barangList.length > 0 ? (
        barangList.map((barang) => (
          <Card key={barang.id} className="bg-white shadow-lg rounded-lg mb-4">
            <CardContent>
              <Typography variant="h5" className="font-bold text-gray-800">
                {barang.name}
              </Typography>
              <Typography variant="body2" className="text-gray-500 mb-4">
                {barang.description}
              </Typography>
              <Divider />

              {/* Display comments related to this barang */}
              <div className="mt-4 space-y-4">
                {komens
                  .filter((komen) => komen.barang_id === barang.id)
                  .map((komen) => (
                    <div key={komen.id} className="p-4 bg-gray-100 rounded-md">
                      <Typography variant="body1" className="text-gray-700 font-semibold">
                        {komen.user_name}:
                      </Typography>
                      <Typography variant="body2" className="text-gray-600">
                        {komen.text}
                      </Typography>
                      
                      {/* Replies for this comment */}
                      {komen.replies?.length > 0 && (
                        <div className="mt-2 space-y-2 pl-4 border-l-2 border-gray-300">
                          {komen.replies.map((reply) => (
                            <div key={reply.id} className="p-2 bg-gray-50 rounded-md">
                              <Typography variant="body2" className="text-gray-500">
                                {reply.user_name} replied:
                              </Typography>
                              <Typography variant="body2" className="text-gray-600">
                                {reply.text}
                              </Typography>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography variant="h6" className="text-gray-500 text-center">
          No items found for this user.
        </Typography>
      )}
      </LayoutAdmin>
    </div>
  )
}

export default Komen
