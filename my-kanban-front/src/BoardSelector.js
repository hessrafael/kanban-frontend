import React from 'react';

function BoardSelector(props) {
  

  //Função para lidar com a mudança de board
  function handleChange(event) {
    props.onChange(event.target.value);
  }

  return (
    <div>
      <label htmlFor="boardSelect">Quadro Selecionado:</label>
      <select id="boardSelect" onChange={handleChange} value={props.value}>
      <option value="">Selecione um Quadro</option>
      {props.allBoards.map(board => (
        <option key={board.id} value={JSON.stringify(board)}>{board.name}</option> 
      ))}
      </select>

    </div>
    
  );
}

export default BoardSelector;
