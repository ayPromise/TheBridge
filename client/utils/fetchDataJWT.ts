const fetchDataJWT = async (
  url: URL,
  jwt: string | null,
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' = 'GET',
  body?: any
) => {
  try {
    const response = await fetch(url.toString(), {
      method,
      headers: {
        Authorization: jwt ? `Bearer ${jwt}` : '',
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to fetch: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    let data = await response.json();
    if (data.data) data = data.data;

    return data;
  } catch (error) {
    throw new Error('An error occurred while fetching data');
  }
};

export default fetchDataJWT;