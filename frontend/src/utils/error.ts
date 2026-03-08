const getErrorMessage = (error: any) => {
  if (error.response?.data?.error) {
    return error.response.data.error;
  }

  return error.message || "An unknown error occurred";
};

export { getErrorMessage };
