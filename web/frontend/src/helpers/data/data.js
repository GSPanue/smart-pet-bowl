const sortByDate = (data) => (
  data.sort((a, b) => (
    new Date(a.timestamp) - new Date(b.timestamp)
  ))
);

export {
  sortByDate
};
