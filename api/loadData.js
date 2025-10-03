import { kv } from '@vercel/kv';

export default async function handler(request, response) {
  try {
    // Mengambil data dari Vercel KV dengan key 'scheduleData'
    const scheduleData = await kv.get('scheduleData');
    
    // Jika tidak ada data, kembalikan objek kosong
    if (!scheduleData) {
      return response.status(200).json({});
    }

    // Mengirim data yang ditemukan
    return response.status(200).json(scheduleData);

  } catch (error) {
    console.error('Error loading data from Vercel KV:', error);
    return response.status(500).json({ error: 'Gagal memuat data.' });
  }
}