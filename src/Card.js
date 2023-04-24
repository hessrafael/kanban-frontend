import React, { useState} from 'react';
import './Card.css';

function Card(props) {
    const { id, name, onDelete, columns, onMove } = props;
    const [selectedColumn, setSelectedColumn] = useState(null);
  
    //Função para lidar com a coluna de destino selecionada
    function handleColumnChange(event) {
        setSelectedColumn(event.target.value);
      }
    
    //Função para lidar com a exclusão do card  
    function handleDeleteCard() {
      onDelete(id);
    }
  
    //Função para lidar com o mover de um card
    function handleMoveCard() {
        onMove(id, selectedColumn)
      }

    return (
      <div className="card" class='Card'>
        <div class='EraseBtn'>               
            <button onClick={handleDeleteCard} class='EraseBtnText'>X</button> 
        </div>   
        
        <div class='Text'>
            <text >{name}</text>
        </div>     
              
        <div >
            <select value={selectedColumn} onChange={handleColumnChange} class='Select'>
                <option value="">Selecione Status Destino</option>
                {columns.map((column) => (
                    <option key={column.id} value={column.id}>
                        {column.name}
                    </option>
                ))}
            </select>
            {/*Desabilita o botão se não há coluna selecionada*/}
            <button onClick={handleMoveCard} disabled={!selectedColumn} class='SelectMove'>Mover</button> 
        </div>
        
        
            
      </div>
    );
  }
  
  export default Card;
