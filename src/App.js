import React, { useState, useEffect } from 'react';
import BoardSelector from './BoardSelector';
import BoardAdd from './BoardAdd';
import CardAdd from './CardAdd';
import Card from './Card';
import ColumnAdd from './ColumnAdd';
import './App.css';

function App() {
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [allBoards, setAllBoards] = useState([])
  const [columns, setColumns] = useState([]);

  //função a ser executada para atualizar o board após adição/movimentação de card ou adição coluna
  function updateSelectedBoardData() { 
    //busca todos os boards que existem
    fetch('http://localhost:5000/all_boards')
      .then(response => response.json())
      .then(data => setAllBoards(data)) //atualiza o status de todos os boards que existem
      .catch(error => console.log(error));
    if (selectedBoard) {
    //Eu busco o board selecionado
    const board = encodeURIComponent(JSON.parse(selectedBoard).name); 
    const url = `http://localhost:5000/board?name=${board}`; 
    //Com o board selecionado, busco as colunas
    fetch(url)
      .then(response => response.json()) 
      .then(data => setColumns(data.columns)) //Atualizo as minhas colunas
      .catch(error => console.log(error));
  }}
  
  
  //TODO: Ver como passar uma função no useEffect
  //useEffect é executado sempre que o componente é criado ou atualizado 
  useEffect(() => { 
    //busca todos os boards que existem
    fetch('http://localhost:5000/all_boards')
      .then(response => response.json())
      .then(data => setAllBoards(data)) //atualiza o status de todos os boards que existem
      .catch(error => console.log(error));
    
    if (selectedBoard) {
      //Eu busco o board selecionado
      const board = encodeURIComponent(JSON.parse(selectedBoard).name);
      const url = `http://localhost:5000/board?name=${board}`; 
      //Com o board selecionado, busco as colunas
      fetch(url)
        .then(response => response.json()) 
        .then(data => setColumns(data.columns)) //Atualizo as minhas colunas
        .catch(error => console.log(error));
    }
  }, [selectedBoard]); //[selectedBoard] é a condição para executar o useEffect

  //Handler para lidar com a mudança dos boards
  function handleBoardChange(board) {
    setSelectedBoard(board);
  }

  //Handler para lidar com a adição dos boards
  function handleAddBoard({name,columns}){
    //Constroi o formulário para adição do board com nome e colunas
    const formData = new FormData();
    formData.append('name', name);
    columns.forEach(column => {
      formData.append('columns', column.name);
    });

    //Envia a requisição para adição do board
    fetch('http://localhost:5000/add_board',{      
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },      
        body: formData
      })
      .then(response => {
        if(!response.ok) {
          throw new Error('Erro ao adicionar o quadro.');
        }
        return response.json();
      })
      .then(data => setSelectedBoard(JSON.stringify(data))) //Seleciona o board recém adicionado como default
      .then(() => {
        //Atualiza os dados do board selecionado
        updateSelectedBoardData();
      })      
      .catch(error => {
        alert(error.message);
        console.log(error);
      });      

    }
    
    //Handler para lidar com a adição de Cards
    function handleAddCard(card){
      //Constroi o formulário para adição do card com nome, coluna e board
      const formData = new FormData();
      formData.append('name', card.name);
      formData.append('col_name', card.column);
      formData.append('board_id', JSON.parse(selectedBoard).id);      

      //Envia a requisição para adição do board
      fetch('http://localhost:5000/add_card',{      
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },      
        body: formData
      })
      .then(response => response.json())
      .then(() => {
        //Atualiza os dados do board selecionado
        updateSelectedBoardData();
      })            
      .catch(error => console.log(error));      
    }
  
  

    //Handler para lidar com a deleção de Cards
    function handleDeleteCard(cardId) {
      //Constroi a URL com o ID do card a ser deletado
      const id = encodeURIComponent(cardId);
      const url = `http://localhost:5000/del_card?card_id=${id}`
      //Envia a requisição para deleção do card
      fetch(url,{      
        method: 'DELETE',
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(response => response.json())
      .then(() => {
        //Atualiza os dados do board selecionado
        updateSelectedBoardData();
      })      
      .catch(error => console.log(error));

    }

    //Handler para lidar com a adição de colunas
    function handleAddColumns({boardId,columnsName}) {
    //Constroi formulário para envio da informação dos nomes das colunas e o board de destino
    const formData = new FormData();
    formData.append('board_id', boardId);
    columnsName.forEach(column => {
      formData.append('columns_name', column.name);
    });

    //Envia a requisição para adição de colunas
    fetch('http://localhost:5000/add_cols',{      
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },      
        body: formData
      })
      .then(response => response.json())
      .then(() => {
        //Atualiza os dados do board selecionado
        updateSelectedBoardData();
      })      
      .catch(error => console.log(error));     

    }

    //Handler para lidar com a movimentação dos cards
    function handleMoveCard(cardId,destCol){
      //Constroi formulário para envio da informação do id do card e da coluna de destino
      const formData = new FormData();
        formData.append('card_id', cardId)
        formData.append('dest_col', destCol);
        const url = `http://localhost:5000/move_card`;
        
        //Envia a requisição para mover o card
        fetch(url, {
          method: 'PATCH',
          headers: {
            'Accept': 'application/json'
          },
          body: formData
        })
        .then(response => response.json())
        .then(() => {
          //Atualiza os dados do board selecionado
          updateSelectedBoardData();
        })
        .catch(error => console.log(error));

                

    }
  //Ai ele retorna (re-renderiza) os componentes com base na quantidade de colunas e dos quadros
  //TODO: ver certinho o que é o método map no react e arrumar o código de renderizar as colunas
  return (  
    <div>     
      <h1 class='Title'>Bem vindo ao seu portal de Gestão</h1>
      {/* apresenta o seletor de board caso haja algum board já */}
      {allBoards.length !=0 && (<div class="Border">
        <h2>Para começar, selecione um Quadro de Gestão abaixo</h2>
        <BoardSelector onChange={handleBoardChange} allBoards={allBoards} value={selectedBoard}/>
      </div>)}
      
      
      <div class="Border">
        <h3>Deseja adicionar um novo Quadro de Gestão?</h3>
        <BoardAdd onSubmit={handleAddBoard}/>
      </div>     
      
        {/* Apresenta os elementos do Board somente se há um Board selecionado */}
        {selectedBoard && (
          <div>
            <h2 class="Border">Quadro de Gestão: {JSON.parse(selectedBoard).name}</h2>
            <div class="BorderRow">
              <span >
                <CardAdd onSubmit={handleAddCard} columns={columns}/>
              </span>
              <span>
                <ColumnAdd onSubmit={handleAddColumns} boardId={JSON.parse(selectedBoard).id}/>
              </span>
            </div>        
            
            {/* Define o componente que renderizará o Board em si - uma tabela */}
            <div class='Board'>
              <table >
                <thead>
                  <tr>
                    {/* Para cada coluna, crio um header na tabela com o seu nome */}
                    {columns.map(column => ( 
                      <th key={column.id} class='TableElement'>{column.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Se tiver ao menos uma coluna crio o corpo da tabela com o numero de linhas igual
                  ao número de cards da maior coluna */}
                  {columns.length > 0 &&
                    Array.from(
                      { length: Math.max(...columns.map((column) => column.total_cards)) },
                      (_, index) => index
                    ).map((rowIndex) => (
                      <tr key={rowIndex} >
                        {columns.map((column) => {
                          const card = column.cards[rowIndex];
                          return (
                            <td key={column.id} class='TableElement'>
                              <div>{/* Se existir card, crio um componente Card */}
                                {card ? <Card name={card.name} id={card.id} onDelete={handleDeleteCard} onMove={handleMoveCard} columns={columns.filter(c => c !== column)} /> : null}
                              </div>                              
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      

      </div>

      
);
}

export default App;
