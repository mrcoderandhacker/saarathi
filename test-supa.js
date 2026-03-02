import 'dotenv/config';

async function testFetch() {
  const url = 'https://jqchzznzhcuqlpmqakmd.supabase.co/rest/v1/session_templates?select=*';
  const apikey = process.env.VITE_SUPABASE_ANON_KEY;
  
  // Try as anonymous first
  console.log('--- Testing Anon Request ---');
  let res = await fetch(url, {
    headers: {
      'apikey': apikey,
      'Authorization': `Bearer ${apikey}`
    }
  });
  console.log('Status:', res.status);
  console.log('Body:', await res.text());

  // Wait, I don't have the user's JWT. But anon should work IF the table allows it.
}

testFetch();
