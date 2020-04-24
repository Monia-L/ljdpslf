export type CreateGameAPIResponse = { id: string };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const callApi = async (path: string, method = 'GET'): Promise<any> => {
  const response = await fetch(`/api/${path}`, { method });
  return response.json();
};

export { callApi };
