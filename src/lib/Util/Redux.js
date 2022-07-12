export function pipeReducers(...reducers){
    return (state, action)=>{
        let nextState = state;
        for (let reducer of reducers) {
            nextState = reducer.call(reducer, nextState, action);
        }
        return nextState;
    }
}