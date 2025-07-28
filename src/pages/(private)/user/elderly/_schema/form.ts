export const rules = {
  name: [{ required: true, message: 'Nama lengkap wajib diisi', trigger: ['blur', 'input'] }],
  dateOfBirth: [
    { required: true, message: 'Tanggal lahir wajib diisi', trigger: ['blur', 'input'] }
  ],
  placeOfBirth: [
    { required: true, message: 'Tempat lahir wajib diisi', trigger: ['blur', 'input'] }
  ],
  gender: [{ required: true, message: 'Jenis kelamin wajib diisi', trigger: ['blur', 'input'] }],
  address: [{ required: true, message: 'Alamat wajib diisi', trigger: ['blur', 'input'] }],
  phone: [{ required: true, message: 'Nomor telepon wajib diisi', trigger: ['blur', 'input'] }],
  bloodType: [{ required: true, message: 'Golongan darah wajib diisi', trigger: ['blur', 'input'] }]
}
