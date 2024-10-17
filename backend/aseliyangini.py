from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID, uuid4

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

users = []
kategoris = []
barangs = []
pesanans = []
komentars = []
keranjangs = []

class User(BaseModel):
    id: Optional[UUID] = None
    nama: str
    password: str
    alamat: Optional[str] = None
    role:  Optional[str] = "pembeli"

class Kategori(BaseModel):
    id: Optional[UUID] = None
    nama_kategori: str

class Barang(BaseModel):
    id: Optional[UUID] = None
    nama: str
    deskripsi: str
    harga: float
    gambar_url: str  
    kategori_id: UUID
    penjual_id: UUID  

class Pesanan(BaseModel):
    id: Optional[UUID] = None
    pembeli_id: UUID  
    keranjang_id: UUID
    kuantitas: int

class Komentar(BaseModel):
    id: Optional[UUID] = None
    teks_komentar: str
    barang_id: UUID
    user_id: UUID
    mention_id: Optional[UUID] = None  

class Keranjang(BaseModel):
    id: Optional[UUID] = None
    barang_id: UUID
    user_id: UUID
    kuantitas: int
    penanan_num :int

@app.get("/")
def home():
    return {"project_akhir": "dasar pemrograman"}

@app.post("/register/")
def register_user(user: User):
    for existing_user in users:
        if existing_user.nama == user.nama:
            raise HTTPException(status_code=400, detail="Pengguna sudah ada")

    user.id = uuid4()
    users.append(user)
    return {"user_id": user.id,"role" : user.role}



@app.post("/login/")
def login_user(user: User):
    for existing_user in users:
        if existing_user.nama == user.nama and existing_user.password == user.password:
            return {"user_id": existing_user.id, "role": existing_user.role}
    raise HTTPException(status_code=404, detail="Nama pengguna atau kata sandi salah")



@app.get("/users/", response_model=List[User])
def lihat_semua_pengguna():
    return users



@app.post("/kategoris/", response_model=Kategori)
def buat_kategori(kategori: Kategori):
    kategori.id = uuid4()
    kategoris.append(kategori)
    return kategori



@app.get("/kategoris/", response_model=List[Kategori])
def lihat_semua_kategori():
    return kategoris



@app.post("/barangs/", response_model=Barang)
def buat_barang(barang: Barang):
    barang.id = uuid4()
    if not any(user.id == barang.penjual_id and user.role == "penjual" for user in users):
        raise HTTPException(status_code=404, detail="Penjual tidak ditemukan atau tidak terdaftar sebagai penjual")
    
    barangs.append(barang)
    return barang


@app.get("/barangs/", response_model=List[Barang])
def lihat_semua_barang():
    return barangs



@app.get("/barangs/{barang_id}", response_model=Barang)
def lihat_barang(barang_id: UUID):
    for barang in barangs:
        if barang.id == barang_id:
            return barang
    raise HTTPException(status_code=404, detail="Barang tidak ditemukan")



@app.put("/barangs/{barang_id}", response_model=Barang)
def update_barang(barang_id: UUID, barang_baru: Barang):
    for index, barang in enumerate(barangs):
        if barang.id == barang_id:
            if not any(user.id == barang_baru.penjual_id and user.role == "penjual" for user in users):
                raise HTTPException(status_code=404, detail="Penjual tidak ditemukan atau tidak terdaftar sebagai penjual")
            
            barangs[index] = barang_baru
            barangs[index].id = barang_id  
            return barangs[index]
    raise HTTPException(status_code=404, detail="Barang tidak ditemukan")



@app.delete("/barangs/{barang_id}")
def hapus_barang(barang_id: UUID):
    for index, barang in enumerate(barangs):
        if barang.id == barang_id:
            del barangs[index]
            return {"detail": "Barang berhasil dihapus"}
    raise HTTPException(status_code=404, detail="Barang tidak ditemukan")



@app.post("/pesanans/", response_model=Pesanan)
def buat_pesanan(pesanan: Pesanan):
    pesanan.id = uuid4()
    if not any(user.id == pesanan.pembeli_id and user.role == "pembeli" for user in users):
        raise HTTPException(status_code=404, detail="Pembeli tidak ditemukan atau tidak terdaftar sebagai pembeli")
    if not any(barang.id == pesanan.barang_id for barang in barangs):
        raise HTTPException(status_code=404, detail="Barang tidak ditemukan")
    
    pesanans.append(pesanan)
    return pesanan



@app.get("/pesanans/", response_model=List[Pesanan])
def lihat_semua_pesanan():
    return pesanans



@app.get("/pesanans/{pesanan_id}", response_model=Pesanan)
def lihat_pesanan(pesanan_id: UUID):
    for pesanan in pesanans:
        if pesanan.id == pesanan_id:
            return pesanan
    raise HTTPException(status_code=404, detail="Pesanan tidak ditemukan")



@app.delete("/pesanans/{pesanan_id}")
def hapus_pesanan(pesanan_id: UUID):
    for index, pesanan in enumerate(pesanans):
        if pesanan.id == pesanan_id:
            del pesanans[index]
            return {"detail": "Pesanan berhasil dihapus"}
    raise HTTPException(status_code=404, detail="Pesanan tidak ditemukan")



@app.post("/keranjangs/", response_model=Keranjang)
def buat_keranjang(keranjang: Keranjang):
    keranjang.id = uuid4()
    if not any(user.id == keranjang.user_id and user.role == "pembeli" for user in users):
        raise HTTPException(status_code=404, detail="Pembeli tidak ditemukan atau tidak terdaftar sebagai pembeli")
    if not any(barang.id == keranjang.barang_id for barang in barangs):
        raise HTTPException(status_code=404, detail="Barang tidak ditemukan")
    
    keranjangs.append(keranjang)
    return keranjang



@app.get("/keranjangs/", response_model=List[Keranjang])
def lihat_semua_keranjang():
    return keranjangs



@app.get("/keranjangs/{keranjang_id}", response_model=Keranjang)
def lihat_keranjang(keranjang_id: UUID):
    for keranjang in keranjangs:
        if keranjang.id == keranjang_id:
            return keranjang
    raise HTTPException(status_code=404, detail="Keranjang tidak ditemukan")


@app.delete("/keranjangs/{keranjang_id}")
def hapus_keranjang(keranjang_id: UUID):
    for index, keranjang in enumerate(keranjangs):
        if keranjang.id == keranjang_id:
            del keranjangs[index]
            return {"detail": "Keranjang berhasil dihapus"}
    raise HTTPException(status_code=404, detail="Keranjang tidak ditemukan")



@app.post("/komentars/", response_model=Komentar)
def buat_komentar(komentar: Komentar):
    komentar.id = uuid4()
    if not any(barang.id == komentar.barang_id for barang in barangs):
        raise HTTPException(status_code=404, detail="Barang tidak ditemukan")
    if not any(user.id == komentar.user_id for user in users):
        raise HTTPException(status_code=404, detail="Pengguna tidak ditemukan")
    
    komentars.append(komentar)
    return komentar



@app.get("/komentars/", response_model=List[Komentar])
def lihat_semua_komentar():
    return komentars



@app.get("/komentars/filter/", response_model=List[Komentar])
def filter_komentar(barang_id: Optional[UUID] = None, user_id: Optional[UUID] = None):
    filtered_komentars = komentars

    if barang_id:
        filtered_komentars = [komentar for komentar in filtered_komentars if komentar.barang_id == barang_id]

    if user_id:
        filtered_komentars = [komentar for komentar in filtered_komentars if komentar.user_id == user_id]

    return filtered_komentars



@app.get("/komentars/{komentar_id}", response_model=Komentar)
def lihat_komentar(komentar_id: UUID):
    for komentar in komentars:
        if komentar.id == komentar_id:
            return komentar
    raise HTTPException(status_code=404, detail="Komentar tidak ditemukan")



@app.delete("/komentars/{komentar_id}")
def hapus_komentar(komentar_id: UUID):
    for index, komentar in enumerate(komentars):
        if komentar.id == komentar_id:
            del komentars[index]
            return {"detail": "Komentar berhasil dihapus"}
    raise HTTPException(status_code=404, detail="Komentar tidak ditemukan")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)