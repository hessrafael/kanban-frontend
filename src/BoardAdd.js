import React, { useState} from 'react';

function BoardAdd(props) {
    const [nbCols, setNbCols] = useState(1);
    const [boardName, setBoardName] = useState(null)
    const [colsNames, setColsNames] = useState([])

    //Reseta os campos do formulário após a adição
    function clearStates(){
        setNbCols(1);
        setBoardName("");
        setColsNames([]);
    }

    //Atualiza os nomes das colunas no formulário
    function handleColsName(colName,index){
        const updatedColsNames = [...colsNames];
        updatedColsNames[index] = colName
        setColsNames(updatedColsNames) 
       
    }
    
    //Atualiza a quantidade de colunas a serem adicionadas
    function handleNbColsChange(event) {
        const newNbCols = event.target.value;
        setNbCols(newNbCols);

        //Verifica se colsNames precisa ser atualizado
        if (colsNames.length > newNbCols) {
            //Se o Array de nomes era maior que o novo número de colunas, corta-se
            setColsNames(colsNames.slice(0, newNbCols));
        }
        else{
            //Se o Array de nomes era menor que o novo número de colunas, cria-se elementos vazios
            const updatedColsNames = [...colsNames];
            for (let i=0; i < (newNbCols-colsNames.length);i++){
                updatedColsNames.push("")                
            }
            setColsNames(updatedColsNames)
        }
        
    }
    
    //Handler para enviar o formulário
    function handleFormSubmit(event){
        event.preventDefault()
        const newBoard = {
            name: boardName,
            columns: colsNames.map(name => ({name}))
        };
              
        props.onSubmit(newBoard);
        //Reseta o componente form
        event.target.reset();
        //Limpa os estados
        clearStates();
       
    }
    
    return (
        <form onSubmit={handleFormSubmit}>
            <div>
                <span>
                    <label htmlFor="boardName">Nome do Quadro:</label>                
                    <input id="boardName" placeholder='Insira o nome do Quadro' onChange={(event) => setBoardName(event.target.value)}></input>
                </span>
                <span>
                    <label htmlFor="nbCols">Número de Status:</label>
                    <input type="number" id ="nbCols" onChange={(event) => handleNbColsChange(event)} min="1" defaultValue = "1"></input>
                </span>                
                
                <div>
                    {Array.from({ length: nbCols }).map((_, index) => (
                        <div>
                            <input key={index} placeholder='Insira o nome do seu Status' onChange={(event) => handleColsName(event.target.value, index)} defaultValue = "" />
                        </div>                                    
                    ))}
                </div>          
                
            </div>
            {/*Ativa o botão de submit apenas se há nome para o board e se todas as colunas tem nome e se o tamanho do vetor é igual ao número de colunas */}
            <button type='submit' disabled={!boardName || colsNames.some(name => !name) || parseInt(colsNames.length) !== parseInt(nbCols)}>Criar Quadro</button>
        </form>
        
        
    )
}
export default BoardAdd;