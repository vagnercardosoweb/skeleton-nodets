import app from './app';

const HOST = String(process.env.HOST || 'localhost');
const PORT = Number(process.env.PORT || 3333);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server started on: http://${HOST}:${PORT}`);
});
