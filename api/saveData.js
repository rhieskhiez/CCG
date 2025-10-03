import { kv } from '@vercel/kv';

export default async function handler(request, response) {
  // Pastikan request method adalah POST
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { data } = request.body;

    // Menyimpan data ke Vercel KV dengan key 'scheduleData'
    await kv.set('scheduleData', data);

    return response.status(200).json({ status: 'success' });

  } catch (error) {
    console.error('Error saving data to Vercel KV:', error);
    return response.status(500).json({ error: 'Gagal menyimpan data.' });
  }
}