import React, { useState} from 'react';
import './CardAdd.css';

function CardAdd(props){
    const [cardName, setCardName] = useState(null)
    const [selectedColumn, setSelectedCol] = useState(null)

    //Função para resetar os campos de adição após adicionar
    function clearStates(){
        setCardName("");
        setSelectedCol("");
    }

    //Função para lidar com o envio do form
    function handleFormSubmit(event){
        event.preventDefault()
        const newCard = {
            name: cardName,
            column: JSON.parse(selectedColumn).name
        };
        props.onSubmit(newCard);
        //Reseta o componente form
        event.target.reset();
        //Limpa os estados
        clearStates();
    }

    //Função para lidar com a alteração do nome do card no input
    function handleNameChange(event){
        setCardName(event.target.value)
    }

    //Função para lidar com a seleção da coluna a qual o card será adicionado
    function handleColChange(event){
        setSelectedCol(event.target.value)        
    }
    
    return(
        
        <form onSubmit={handleFormSubmit} class='CardAdd'>
            <span>
                <input onChange={handleNameChange} placeholder="Insira o descritivo da sua tarefa"></input>
                <select onChange={handleColChange}>
                <option value="">Selecione um Status</option>
                {props.columns.map(col => (
                    <option key={col.id} value={JSON.stringify(col)}>{col.name}</option>))}
                </select>
            </span>
            {/*Botão de submit só é ativado quando há uma coluna selecionada e quando o card tem nome*/}
            <button type='submit' disabled={!selectedColumn || !cardName}>Adicionar Tarefa</button>  
        </form> 
        
        
    )
}

export default CardAdd;