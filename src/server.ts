import app from './app';

const PORT = process.env.PORT || 3333;

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`Servidor iniciado na porta ${PORT}`));
