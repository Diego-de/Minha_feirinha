import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Grid, Card, CardContent, Paper, Menu, MenuItem } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuIcon from '@mui/icons-material/Menu';
import ListAltIcon from '@mui/icons-material/ListAlt';


function App() {

  const [produtos, setProdutos] = useState([]);
  const [contador, setContador] = useState(0);
  const [recentes, setRecentes] = useState([]);
  const [novoProduto, setNovoProduto] = useState('');
  const [mostrarLista, setMostrarLista] = useState(false);
  const [mostrarRecentesProdu, setMostrarRecentesProdu] = useState(false);
  const [produtosL, setProdutosL] = useState([]);
  const [contadorL, setContadorL] = useState(0);
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [mostrarList, setMostrarList] = useState(false);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElL, setAnchorElL] = useState(null);





  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
    setMostrarMenu(true);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMostrarMenu(false);
  };

  const handleListClose = () => {
    setAnchorElL(null);
    setOpen(false)
  };




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


    const indexProdutoExistente = recentes.findIndex((p) => p.nome === produto.nome);
    if (indexProdutoExistente !== -1) {
      const novoRecentes = [...recentes];
      novoRecentes[indexProdutoExistente].quantidade += quantidade;
      setRecentes(novoRecentes);
    } else {
      const novoRecente = { ...produto, quantidade };
      setRecentes([...recentes, novoRecente]);
    }
  };

  const removerProduto = (produto) => {
    setProdutos((prevProdutos) => prevProdutos.filter((p) => p.id !== produto.id));
    setRecentes((prevRecentes) => prevRecentes.filter((p) => p.id !== produto.id));
  
    // Atualizar o localStorage com as novas listas de produtos e produtos recentes
    localStorage.setItem('produtos', JSON.stringify(produtos.filter((p) => p.id !== produto.id)));
    localStorage.setItem('recentes', JSON.stringify(recentes.filter((p) => p.id !== produto.id)));
    localStorage.removeItem('contador')
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
  const AdicionarProdutoOneforOne = (produto) => {
    const novoRecentes = recentes.map((p) => {
      if (p.id === produto.id) {
        return {
          ...p,
          quantidade: p.quantidade + 1,
        };
      }
      return p;
    }).filter((p) => p.quantidade > 0);

    setRecentes(novoRecentes);

    const valorProduto = produto.preco * 1;
    setContador(contador + valorProduto);
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


  useEffect(() => {
    const produtosSalvos = localStorage.getItem('recentes');
    const contadorSalvo = localStorage.getItem('contador');
    if (produtosSalvos && contadorSalvo) {
      setRecentes(JSON.parse(produtosSalvos));
      setContador(JSON.parse(contadorSalvo));
    }
  }, []);


  
  const salvarDados = () => {
    localStorage.setItem('recentes', JSON.stringify(recentes));
    localStorage.setItem('contador', JSON.stringify(contador));
    setMostrarList(true)
  }


  const MostrarDados = (event) => {
    const produtosSalvos = localStorage.getItem('recentes');
    const contadorSalvo = localStorage.getItem('contador');

    setAnchorElL(event.currentTarget);
    setOpen(true);

    if (produtosSalvos && contadorSalvo) {
      setProdutosL(JSON.parse(produtosSalvos));
      setContadorL(JSON.parse(contadorSalvo));
      setMostrarLista(!mostrarLista);
    }
  }


  const removerDados = () => {
    setProdutosL([])
    setContadorL(0)
  }

  const MostrarRecentesProduto = () => {
    setMostrarRecentesProdu(!mostrarRecentesProdu);
  };

  return (
    <Container maxWidth="md" sx={{ marginTop: '25%' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Produtos de Feira
      </Typography>
      <Typography variant="h5" align="center" gutterBottom>
        Contador: R$ {formatarContador(contador)}
      </Typography>

      <Grid container alignItems="center">
        <Grid sx={{ display: 'flex' }}>
          <TextField
            variant="outlined"
            label="Digite o nome do produto"
            fullWidth
            value={novoProduto}
            onChange={(e) => setNovoProduto(e.target.value)}
          />
          <Button
            size='small'
            variant="contained"
            color="primary"
            onClick={adicionarNovoProduto}
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
          <CardContent >
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
        onClick={handleMenuOpen}
        style={{ marginTop: '8px', marginLeft: '8px', position: 'fixed', top: '0', right: '0', zIndex: '999' }}
      >
        <MenuIcon style={{ fontSize: 30, color: 'white' }} />
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={mostrarMenu}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Paper sx={{ maxHeight: 400, overflow: 'auto', width: '100vw', textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Recentes:
          </Typography>
          {recentes.map((produto) => (
            <Card key={produto.id} variant="outlined" style={{ marginBottom: '8px' }}>
              <CardContent>
                <Typography variant="h7" onClick={() => MostrarRecentesProduto()}>
                  {produto.nome} - Quantidade: {produto.quantidade} - valor {formatarContador(produto.preco)}
                </Typography>
                {mostrarRecentesProdu && (
                  <Grid container spacing={1} alignItems="center" sx={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <Grid item xs={3}>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => removerProdutoOneforOne(produto)}

                      >
                        -1
                      </Button>
                    </Grid>
                    <Grid item xs={3}>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => AdicionarProdutoOneforOne(produto)}

                      >
                        +1
                      </Button>
                    </Grid>
                    <Grid item xs={3} sx={{ display: 'flex', justifyContent: 'center', marginTop: '8px' }}>
                      <IconButton
                        variant="contained"
                        color="secondary"
                        onClick={() => removerProduto(produto)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                )}

              </CardContent>
            </Card>
          ))}
          <Button
            variant="contained"
            color="secondary"
            className='btn'
            onClick={salvarDados}
            style={{ marginTop: '8px', marginLeft: '0px', fontSize: '10px' }}
          >
            Salvar alteraçoes
          </Button>

        </Paper>
      </Menu>



      {mostrarList && (
        <Button
          variant="contained"
          color="secondary"
          className='btn'
          onClick={MostrarDados}
          style={{ marginTop: '8px', marginLeft: '8px', position: 'fixed', top: '0', left: '0', zIndex: '999' }}
        >
          <ListAltIcon />
        </Button>
      )}
      {mostrarLista && (
        <Menu
          anchorEl={anchorElL}
          open={open}
          onClose={handleListClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <Paper sx={{ maxHeight: 400, overflow: 'auto', width: "100vw" }}>

            <div>
              <div>
                <Typography variant="h7" gutterBottom>
                  Lista de Produtos e valor total {contadorL}
                </Typography>
                {produtosL.map((produtoL) => (
                  <Card key={produtoL.id} variant="outlined" style={{ marginBottom: '8px' }}>
                    <CardContent>
                      <Typography variant="h7">{produtoL.nome}</Typography>
                      <Typography variant="body2">
                        Preço: R$ {formatarPreco(produtoL.preco)} | Quantidade: {produtoL.quantidade} - total {formatarPreco(produtoL.preco * produtoL.quantidade)}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
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
          </Paper>
        </Menu>
      )}

    </Container>
  );
}

export default App;
