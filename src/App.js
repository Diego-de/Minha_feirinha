import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Grid, Card, CardContent } from '@mui/material';


function App() {
  const [produtos, setProdutos] = useState([]);
  const [contador, setContador] = useState(0);
  const [recentes, setRecentes] = useState([]);
  const [novoProduto, setNovoProduto] = useState('');
  const [mostrarLista, setMostrarLista] = useState(false);
  const [mostrarRecentes, setMostrarRecentes] = useState(false);

  const [produtosL, setProdutosL] = useState([]);
  const [contadorL, setContadorL] = useState(0);


  const adicionarProduto = (produto) => {
    const precoFloat = parseFloat(produto.preco.toString().replace(',', '.'));
    const quantidade = parseInt(produto.quantidade);

    const novoProdutos = produtos.map((p) => {
      if (p.id === produto.id) {
        return {
          ...p,
          preco: precoFloat,
          quantidade: quantidade,
        };
      }
      return p;
    });

    setProdutos(novoProdutos);
    const valorProduto = precoFloat * quantidade;
    setContador(contador + valorProduto);

    const produtoExistente = recentes.find((p) => p.id === produto.id);
    if (produtoExistente) {
      const novoRecentes = recentes.map((p) => {
        if (p.id === produto.id) {
          return {
            ...p,
            quantidade: p.quantidade + quantidade,
          };
        }
        return p;
      });
      setRecentes(novoRecentes);
    } else {
      const novoRecentes = [...recentes, { ...produto, quantidade }];
      setRecentes(novoRecentes);
    }
  };

  const removerProdutoOneforOne = (produto) => {
    const novoRecentes = recentes.map((p) => {
      if (p.id === produto.id) {
        return {
          ...p,
          quantidade: p.quantidade - 1, // Reduzir a quantidade em 1
        };
      }
      return p;
    }).filter((p) => p.quantidade > 0);

    setRecentes(novoRecentes);

    const valorProduto = produto.preco * 1; // Reduzir o valor pelo preço de um produto
    setContador(contador - valorProduto);
  };


  const removerProduto = (produto) => {
    const novoRecentes = recentes.map((p) => {
      if (p.id === produto.id) {
        return {
          ...p,
          quantidade: p.quantidade - produto.quantidade,
        };
      }
      return p;
    }).filter((p) => p.quantidade > 0);

    setRecentes(novoRecentes);

    const valorProduto = produto.preco * produto.quantidade;
    setContador(contador - valorProduto);
  };

  const adicionarNovoProduto = () => {
    if (novoProduto) {
      const novoId = produtos.length + 1;
      const novoProdutoObj = { id: novoId, nome: novoProduto, preco: '0', quantidade: 0 };
      setProdutos([novoProdutoObj, ...produtos]);
      setNovoProduto('');
    }
  };

  const formatarPreco = (valor) => {
    if (valor) {
      const precoFloat = parseFloat(valor.toString().replace(',', '.'));
      if (!isNaN(precoFloat)) {
        const precoFormatado = (precoFloat / 100).toFixed(2).replace('.', ',');
        return precoFormatado;
      }
    }
    return '';
  };


  const formatarContador = (valor) => {
    const precoFloat = valor / 100;
    const valorFormatado = precoFloat.toFixed(2).replace('.', ',');
    return valorFormatado;
  };

  const toggleShowFields = (produto) => {
    setProdutos(
      produtos.map((p) =>
        p.id === produto.id ? { ...p, showFields: !p.showFields } : p
      )
    );
  };


  const salvarDados = () => {
    localStorage.setItem('produtos', JSON.stringify(produtos));
    localStorage.setItem('contador', JSON.stringify(contador));
  }


  const MostrarDados = () => {
    const produtosSalvos = localStorage.getItem('produtos');
    const contadorSalvo = localStorage.getItem('contador');

    if (produtosSalvos && contadorSalvo) {
      setProdutosL(JSON.parse(produtosSalvos));
      setContadorL(JSON.parse(contadorSalvo));
      setMostrarLista(!mostrarLista);
    }
  }


  const removerDados = () => {
    localStorage.removeItem('produtos');
    localStorage.removeItem('contador');
    setMostrarLista(!mostrarLista);
  }

  const MostrarRecentes = () => {
    setMostrarRecentes(!mostrarRecentes);
  };



  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom>
        Produtos de Feira
      </Typography>
      <Typography variant="h5" align="center" gutterBottom>
        Contador: R$ {formatarContador(contador)}
      </Typography>

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={9}>
          <TextField
            variant="outlined"
            label="Digite o nome do produto"
            fullWidth
            value={novoProduto}
            onChange={(e) => setNovoProduto(e.target.value)}
          />
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={adicionarNovoProduto}
            fullWidth
          >
            Adicionar
          </Button>
        </Grid>
      </Grid>

      <Typography variant="h5" gutterBottom>
        Produtos:
      </Typography>
      {produtos.map((produto) => (
        <Card key={produto.id} variant="outlined" style={{ marginBottom: '8px' }}>
          <CardContent>
            <Typography variant="h6" onClick={() => toggleShowFields(produto)}>
              {produto.nome}
            </Typography>
            {produto.showFields && (
              <div>
                <TextField
                  variant="outlined"
                  label="Digite o preço"
                  type="text"
                  fullWidth
                  style={{ marginTop: '8px' }}
                  value={produto.preco === '0' ? '' : formatarPreco(produto.preco)}
                  onChange={(e) => {
                    const preco = e.target.value.replace(',', '');
                    setProdutos([
                      ...produtos.map((p) => (p.id === produto.id ? { ...p, preco: preco } : p)),
                    ]);
                  }}
                />
                <TextField
                  variant="outlined"
                  label="Digite a quantidade"
                  type="number"
                  fullWidth
                  style={{ marginTop: '8px' }}
                  value={produto.quantidade}
                  onChange={(e) => {
                    const quantidade = parseInt(e.target.value);
                    setProdutos([
                      ...produtos.map((p) => (p.id === produto.id ? { ...p, quantidade } : p)),
                    ]);
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => adicionarProduto(produto)}
                  style={{ marginTop: '8px' }}
                >
                  Adicionar
                </Button>
              </div>
            )}
            {!produto.showFields && (
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setProdutos(produtos.filter((p) => p.id !== produto.id))}
                style={{ marginTop: '8px' }}
              >
                Remover
              </Button>
            )}
          </CardContent>
        </Card>
      ))}


      <Button
        variant="contained"
        color="secondary"
        onClick={() => MostrarRecentes()}
        style={{ marginTop: '8px', marginLeft: '8px' }}
      >
        Mostrar/Esconder Recentes
      </Button>
      {mostrarRecentes && (
        <>
          <Typography variant="h5" gutterBottom>
            Recentes:
          </Typography>
          {recentes.map((produto) => (
            <Card key={produto.id} variant="outlined" style={{ marginBottom: '8px' }}>
              <CardContent>
                <Typography variant="h6">
                  {produto.nome} - Quantidade: {produto.quantidade}
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => removerProdutoOneforOne(produto)}
                  style={{ marginTop: '8px' }}
                >
                  -1
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => removerProduto(produto)}
                  style={{ marginTop: '8px', marginLeft: '8px' }}
                >
                  Remover
                </Button>
              </CardContent>
            </Card>
          ))}
          <Button
            variant="contained"
            color="secondary"
            onClick={() => salvarDados()}
            style={{ marginTop: '8px', marginLeft: '8px' }}
          >
            Salvar
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => MostrarDados()}
            style={{ marginTop: '8px', marginLeft: '8px' }}
          >
            Mostrar
          </Button>
        </>
      )}

      {mostrarLista && (
        <div>
          <div>
            <Typography variant="h5" gutterBottom>
              Lista de Produtos:
            </Typography>
            {produtosL.map((produto) => (
              <Card key={produto.id} variant="outlined" style={{ marginBottom: '8px' }}>
                <CardContent>
                  <Typography variant="h6">{produto.nome}</Typography>
                  <Typography variant="body2">
                    Preço: R$ {formatarPreco(produto.preco)} | Quantidade: {produto.quantidade}
                  </Typography>
                </CardContent>
              </Card>
            ))}
            <Typography variant="h5" align="center" gutterBottom>
              Contador Total: R$ {formatarContador(contadorL)}
            </Typography>
          </div>
          <div>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => removerDados()}
              style={{ marginTop: '8px', marginLeft: '8px' }}
            >
              Clear
            </Button>

          </div>
        </div>
      )}
    </Container>
  );
}

export default App;
