import React, { useState} from 'react';
import './ColumnAdd.css';

function ColumnAdd(props){    
    const [colsNames, setColsNames] = useState("")

    //Função para resetar os campos de adição após adicionar
    function clearStates(){
        setColsNames("");
    }
    
    //Função para lidar com o envio do form
    function handleFormSubmit(event){
        event.preventDefault()
        //Separa os nomes das colunas entre vírgulas para criação em batch
        const colsNameArray = colsNames.split(",")
        const newColumns = {
            boardId: props.boardId,
            columnsName: colsNameArray.map(name => ({name}))
        };        
        props.onSubmit(newColumns);
        //Reseta o componente form
        event.target.reset();
        //Limpa os estados
        clearStates();
    }
    
    return(
        <span>
            <form onSubmit={handleFormSubmit} class='ColumnAdd'>
            <div>
                <label htmlFor="cardName">Nome da Coluna:</label>
                <input id="cardName" type="text" placeholder='Insira o nome do Status a ser adicionado' onChange={(event) => setColsNames(event.target.value)}></input>
            </div>
            {/* Habilita o submit apenas se há texto inserido */}
            <button type='submit' disabled={!colsNames}>Adicionar Status</button>
            </form>
        </span>
        
        
    )
}

export default ColumnAdd;