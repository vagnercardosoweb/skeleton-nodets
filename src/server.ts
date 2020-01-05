import app from './app';

const HOST = String(process.env.HOST || '0.0.0.0');
const PORT = Number(process.env.PORT || 3333);

app.listen(PORT, HOST, () => {
  // eslint-disable-next-line no-console
  console.log(`Server started on: http://${HOST}:${PORT}`);
});
